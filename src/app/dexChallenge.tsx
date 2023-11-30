'use client'
import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { Dialog } from 'primereact/dialog';
import { ScrollPanel } from 'primereact/scrollpanel';
import { useReward } from 'react-rewards';
import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/lara-dark-indigo/theme.css'
import 'primereact/resources/primereact.min.css'

type Props = {
	Data: Pokemon[]
}

type Pokemon = {
	Nat: number,
	Pokemon: string
}

export default function DexChallenge(data: Props) {
	const [dexNumber, setDexNumber] = useState(0);
	const [guess, setGuess] = useState("");
	const [filteredPokemon, setFilteredPokemon] = useState([] as string[]);
	const [score, setScore] = useState(0);
	const [lives, setLives] = useState(5);
	const maxSkips = 5;
	const [skips, setSkips] = useState(maxSkips);

	const [confettiEnabled, setConfettiEnabled] = useState(true);
	const { reward, isAnimating } = useReward('rewardId', 'confetti');
	const [correctGuesses, setCorrectGuesses] = useState([] as Pokemon[]);

	const [dWrongGuess, setDWrongGuess] = useState(false);
	const [dSkip, setDSkip] = useState(false);
	const [dGameOver, setDGameOver] = useState(false);

	const inputRef = useRef(null as unknown as AutoComplete);

	const getRandomDexNumber = () => {
		setDexNumber(Math.floor(Math.random() * 1017));
	}
	useEffect(() => {
		getRandomDexNumber();
	}, []);

	const searchPokemon = (event) => {
		let _filteredPokemon;
		if (!event.query.trim().length) {
			_filteredPokemon = [...data.Data.map((pokemon) => pokemon.Pokemon)];
		} else {
			_filteredPokemon = data.Data.map((pokemon) => pokemon.Pokemon).filter((pokemon) => {
				return pokemon.toLowerCase().startsWith(event.query.toLowerCase());
			});
		}
		setFilteredPokemon(_filteredPokemon);
	}

	const getPokemon = () => {
		return data.Data.filter((item) => item.Nat === dexNumber)[0]?.Pokemon;
	}

	const guessPokemon = () => {
		const currentPokemon = getPokemon();
		if (guess === "") {
			// Tell user to enter a Pokemon
			return;
		}
		if (guess.toString().toLowerCase() === currentPokemon.toLowerCase()) {
			// Success
			if (confettiEnabled) {
				reward();
			}
			setCorrectGuesses([...correctGuesses, data.Data.filter((item) => item.Nat === dexNumber)[0]]);
			getRandomDexNumber();
			setGuess("");
			setScore(score + 1);
		} else if (!filteredPokemon.map((x) => x.toLowerCase()).includes(guess)) {
			// Tell user that it's not a valid Pokemon
		} else {
			// Failure
			inputRef.current.getInput().blur();
			inputRef.current.hide();
			setLives(lives - 1);
			if (lives === 1) {
				setDGameOver(true);
			} else {
				setDWrongGuess(true);
			}
		}
	}

	const skip = () => {
		setDSkip(false);
		setGuess("");
		setTimeout(() => {
			getRandomDexNumber();
		}, 200);
	}

	const reset = () => {
		setDGameOver(false);
		setDWrongGuess(false);
		setDSkip(false);
		setGuess("");
		setScore(0);
		setLives(5);
		setSkips(maxSkips);
		getRandomDexNumber();
		setCorrectGuesses([]);
	}

	const copyScore = () => {
		const text = `I got ${score} Pokémon right in the Pokédex Challenge!
I used ${maxSkips - skips} skips.
Can you beat my score? https://dex.lmnts.tech`;
		navigator.clipboard.writeText(text);
	}

	return (
		<>
			{/* Wrong Guess */}
			<Dialog header="Wrong Guess!" visible={dWrongGuess} style={{ width: '50vw', maxWidth: '50rem' }} draggable={false} closable={false} onHide={() => setDWrongGuess(false)}>
				<p className="text-2xl">You guessed {guess}.</p>
				<p className="text-2xl">You have {lives} lives left.</p>
				<div className="mt-6 flex flex-row justify-center space-x-4">
					<Button className="w-1/2" label={"Skip (" + skips + " skips left)"} onClick={() => { setDWrongGuess(false); setSkips(skips - 1); setDSkip(true); }} disabled={skips === 0} />
					<Button className="w-1/2" label="Try Again" onClick={() => setDWrongGuess(false)} />
				</div>
			</Dialog>
			{/* Skip */}
			<Dialog header="Pokémon Skipped" visible={dSkip} style={{ width: '50vw', maxWidth: '50rem' }} draggable={false} closable={false} onHide={() => setSkips(skips - 1)}>
				<p className="text-2xl">The correct answer for Dex #{dexNumber} was {getPokemon()}.</p>
				<p className="text-2xl">You have {skips} skips left.</p>
				<div className="mt-6 flex flex-row justify-center">
					<Button className="w-1/2" label="Continue" onClick={() => { skip(); }} />
				</div>
			</Dialog>
			{/* Game Over */}
			<Dialog header="Game Over" visible={dGameOver} style={{ width: '50vw', maxWidth: '50rem' }} draggable={false} closable={false} onHide={() => reset()}>
				<p className="text-xl sm:text-2xl">
					Final score: {score}
				</p>
				<p className="text-xl sm:text-2xl">
					Skips used: {maxSkips - skips}
				</p>
				<p className="text-lg mt-4 sm:text-xl">
					These are the Pokémon you got right:
				</p>
				<ScrollPanel className="p-2" style={{ height: '10rem', maxHeight: '10rem' }}>
					<ul>
						{correctGuesses.map((item, i) =>
							<li key={i} className="border py-1 px-2 mb-2 rounded flex">
								<span className="grow">
									{item.Pokemon}
								</span>
								<span>
									#{item.Nat}
								</span>
							</li>
						)}
					</ul>
				</ScrollPanel>
				<div className="mt-3 flex flex-row space-x-2 justify-center">
					<Button className="text-2xl p-2" label="📋" severity="info" outlined onClick={() => copyScore()} />
					<Button className="w-1/3" label="Play Again" onClick={() => reset()} />
				</div>
			</Dialog>

			<div className="h-full flex flex-col grow justify-between">
				<div className="flex flex-row justify-between">
					<div className="flex flex-col">
						<p className="text-2xl text-left md:text-3xl lg:text-4xl">Lives: {lives}</p>
						<p className="text-2xl text-left md:text-3xl lg:text-4xl">Skips Left: {skips}/{maxSkips}</p>
					</div>
					<div className="flex flex-col">
						<p className="text-2xl text-right md:text-3xl lg:text-4xl">Score: {score}</p>
						<div className="justify-between flex items-center">
							<span className="text-lg md:text-xl pr-3">Confetti: </span>
							<InputSwitch checked={confettiEnabled} onChange={(e) => setConfettiEnabled(e.value)} className="text-xl text-right md:text-3xl lg:text-4xl" />
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center lg:flex-row">
					<p className="text-4xl text-center flex-1 pb-6 lg:pb-0 lg:text-left md:text-5xl">What Pokémon is Dex #{dexNumber}?</p>
					<AutoComplete ref={inputRef} inputClassName="text-2xl md:text-3xl" size={20} value={guess} suggestions={filteredPokemon} completeMethod={searchPokemon} onChange={(e) => setGuess(e.value)} onKeyUp={(e) => { if (e.code === "Enter") { guessPokemon(); } }} dropdown />
				</div>
				<div className="flex flex-col space-y-4">
					<span id="rewardId" className="self-center z-20" />
					<Button label="Guess" onClick={() => guessPokemon()} className="w-full text-3xl" />
					<Button label="Skip" severity="danger" onClick={() => { setSkips(skips - 1); setDSkip(true); }} className="w-full text-3xl" disabled={skips === 0} />
				</div>
			</div>
		</>
	)
}