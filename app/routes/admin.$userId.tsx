import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import { differenceInMinutes, format } from "date-fns";
import { useState } from "react";
import { requireUserId } from "~/utils/auth.server";
import { getUser } from "~/utils/user.server";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	await requireUserId(request);
	const user = await getUser(params.userId as string);

	return user;
};
export function minutos(
	entry: Date,
	outLunch: Date,
	entryLunch: Date,
	exit: Date
) {
	const minuts =
		differenceInMinutes(outLunch, entry) +
		differenceInMinutes(exit, entryLunch);
	return minuts;
}
export function horasDia(
	entry: Date,
	outLunch: Date,
	entryLunch: Date,
	exit: Date
) {
	const minuts =
		differenceInMinutes(outLunch, entry) +
		differenceInMinutes(exit, entryLunch);
	const horas = Math.floor(minuts / 60);
	const totalMinuts = minuts % 60;

	return horas + "h " + totalMinuts + "min";
}
export default function User() {
	const user = useLoaderData<typeof loader>();
	const [ano, SetAno] = useState(String(new Date().getFullYear()));
	const [mes, SetMes] = useState(
		String(new Date().getMonth() + 1).padStart(2, "0")
	);
	const dia = String(new Date().getDate()).padStart(2, "0");

	const pontoMesAnos = user?.timeSheet.filter((t) =>
		t.in?.includes(ano + "-" + mes)
	);
	console.log(minutos);

	pontoMesAnos?.map((t) => [
		t.in,
		t.outLunch,
		t.inLunch,
		t.out,
		(t.min = minutos(
			t.in ? t.in : "",
			t.outLunch ? t.outLunch : "",
			t.inLunch ? t.inLunch : "",
			t.out ? t.out : ""
		)),
	]);

	const soma = pontoMesAnos?.reduce(
		(acumulador, min) => acumulador + min.min,
		0
	);

	const HorasTotalMes = Math.floor(soma / 60) + "h " + (soma % 60) + "min";
	console.log(ano);
	console.log(HorasTotalMes);
	const dayFilter = user?.timeSheet.filter(
		(d) => d.day == dia + "-" + mes + "-" + ano
	);
	return (
		<>
			<nav className='bg-slate-200'>
				<div className='max-w-7xl mx-auto p-2 sm:px-6 lg:px-8 flex items-center justify-between'>
					<img className='w-32 lg:w-56' src='../logosvg.svg' alt='logo' />

					<select
						className='rounded  md:block  text-blue-600 h-8 w-28 md:w-40 print:text-black print:w-32 pl-5 pr-10 hover:border-gray-400 focus:outline-none appearance-none'
						value={mes}
						onChange={(e) => SetMes(e.target.value)}>
						<option hidden={true} value=''>
							Selecione o Mês:
						</option>
						<option value='01'>Janeiro</option>
						<option value='02'>Fevereiro</option>
						<option value='03'>Março</option>
						<option value='04'>Abril</option>
						<option value='05'>Maio</option>
						<option value='06'>Junho</option>
						<option value='07'>Julho</option>
						<option value='08'>Agosto</option>
						<option value='09'>Setembro</option>
						<option value='10'>Outubro</option>
						<option value='11'>Novembro</option>
						<option value='12'>Dezembro</option>
					</select>

					<select
						className='rounded hidden md:block  print:text-black text-blue-600 h-8 print:w-32 w-24 md:w-40 pl-5 pr-10 hover:border-gray-400 focus:outline-none appearance-none'
						value={ano}
						onChange={(e) => SetAno(e.target.value)}>
						<option hidden={true} value=''>
							Selecione o Ano:
						</option>
						<option value='2021'>2021</option>
						<option value='2022'>2022</option>
						<option value='2023'>2023</option>
						<option value='2024'>2024</option>
						<option value='2025'>2025</option>
					</select>
					<div className='flex flex-col md:flex-row  items-center gap-4 md:p-4'>
						{user && (
							<div className='font-bold md:text-xl'>
								{user?.firstName + " " + user?.lastName}
							</div>
						)}
						<div className='text-center'>
							<NavLink
								className=' print:hidden rounded-xl bg-red-500 font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1'
								to='/admin'
								end>
								Voltar
							</NavLink>
						</div>
					</div>
				</div>
			</nav>
			<div className='flex items-center bg-slate-100  place-content-around'>
				<p className=' font-semibold text-center p-5'>Horas Mensais </p>
				<p className=' font-semibold  font-mono text-blue-600'>
					{HorasTotalMes === "NaNh NaNmin" ? "" : HorasTotalMes}
				</p>
			</div>
			<div className=' w-11/12 container'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className=''>Dia</TableHead>
							<TableHead className=''>Entrada</TableHead>
							<TableHead className=''>Saída Almoço</TableHead>
							<TableHead className=''>Entrada Almoço</TableHead>
							<TableHead className=''>Saída </TableHead>
							<TableHead className=''>Total </TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pontoMesAnos?.map((p, index) => (
							<TableRow key={index}>
								<TableCell>{p.day}</TableCell>
								<TableCell>
									{p.in !== null ? format(p.in, "HH:mm") : "---"}
								</TableCell>
								<TableCell>
									{p.outLunch !== null ? format(p.outLunch, "HH:mm") : "---"}
								</TableCell>
								<TableCell>
									{p.inLunch !== null ? format(p.inLunch, "HH:mm") : "---"}
								</TableCell>
								<TableCell>
									{p.out !== null ? format(p.out, "HH:mm") : "---"}
								</TableCell>
								<TableCell>
									{horasDia(p.in, p.outLunch, p.inLunch, p.out) ===
									"NaNh NaNmin"
										? ""
										: horasDia(p.in, p.outLunch, p.inLunch, p.out)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Form method='post' className='flex place-content-center p-4 '>
					<input
						hidden
						type='text'
						name='userId'
						required
						defaultValue={user?.id}
					/>
				</Form>
			</div>
		</>
	);
}
///foi prara teste
