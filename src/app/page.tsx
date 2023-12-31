import Papa from 'papaparse';
import { promises as fs } from 'fs';
import DexChallenge from './dexChallenge';
import Head from 'next/head';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import Link from 'next/link';

type Pokemon = {
	Nat: number,
	Pokemon: string
}

const dynamicSort = (property) => {
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}
async function getData() {
	const file = await fs.readFile(process.cwd() + '/src/app/dexnumbers.csv', 'utf-8');
	const data = Papa.parse(file, {
		header: true,
		dynamicTyping: true
	});

	return data.data.sort(dynamicSort("Pokemon"));
}

export default async function Home() {
	const data = await getData() as { Nat: number, Pokemon: string }[];

	return (
		<main className="flex h-screen max-w-screen-lg mx-auto flex-col pt-12 px-8 md:pt-24 md:px-24">
			<DexChallenge Data={data} />
			<p className="w-full text-center mt-12 sm:mt-24 mb-6">Made with 💖 by <Link className="text-blue-300" href="https://github.com/HansAnonymous">HansAnonymous</Link></p>
		</main>
	)
}
