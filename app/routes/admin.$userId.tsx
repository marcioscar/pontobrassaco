import type { ActionFunctionArgs } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink, redirect, useLoaderData } from "@remix-run/react";
import { differenceInMinutes, format, isAfter, parse } from "date-fns";
import { useState } from "react";
import { requireUserId } from "~/utils/auth.server";
import { getUser, updateHit } from "~/utils/user.server";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@radix-ui/react-dialog";

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
	if (!entry) {
		entry = 0;
	}
	if (!exit) {
		exit = 0;
	}
	if (!entryLunch) {
		entryLunch = 0;
	}
	if (!outLunch) {
		outLunch = 0;
	}

	const minuts =
		differenceInMinutes(outLunch ? outLunch : entry, entry) +
		differenceInMinutes(exit ? exit : entryLunch, entryLunch);

	return minuts;
}
export function horasDia(
	entry: Date,
	outLunch: Date,
	entryLunch: Date,
	exit: Date
) {
	if (!entry) {
		entry = 0;
	}
	if (!exit) {
		exit = 0;
	}
	if (!entryLunch) {
		entryLunch = 0;
	}
	if (!outLunch) {
		outLunch = 0;
	}
	const minuts =
		differenceInMinutes(outLunch ? outLunch : entry, entry) +
		differenceInMinutes(exit ? exit : entryLunch, entryLunch);
	const horas = Math.floor(minuts / 60);
	const totalMinuts = minuts % 60;

	return horas + "h " + totalMinuts + "min";
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData();
	const values = Object.fromEntries(form);

	await updateHit(values);
	return redirect(".");
};

export default function User() {
	const user = useLoaderData<typeof loader>();
	const [ano, SetAno] = useState(String(new Date().getFullYear()));
	const [mes, SetMes] = useState(
		String(new Date().getMonth() + 1).padStart(2, "0")
	);
	// const dia = String(new Date().getDate()).padStart(2, "0");

	const pontoMesAnos = user?.timeSheet.filter((t) =>
		t.in?.includes(ano + "-" + mes)
	);

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

	// const dayFilter = user?.timeSheet.filter(
	// 	(d) => d.day == dia + "-" + mes + "-" + ano
	// );
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
							<TableHead className='text-center'>Entrada</TableHead>
							<TableHead className='text-center'>Saída Almoço</TableHead>
							<TableHead className='text-center'>Entrada Almoço</TableHead>
							<TableHead className='text-center'>Saída </TableHead>
							<TableHead className='text-center'>Total </TableHead>
							<TableHead className='text-center'>Editar</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pontoMesAnos?.map((p, index) => (
							<TableRow key={index}>
								<TableCell>{p.day}</TableCell>
								<TableCell
									className={
										isAfter(
											parse(format(p.in, "HH:mm"), "HH:mm", new Date()),
											parse("08:00", "HH:mm", new Date())
										)
											? "bg-red-500 rounded-xl text-white text-center"
											: "text-center"
									}>
									{p.in !== null ? format(p.in, "HH:mm") : "---"}
								</TableCell>
								<TableCell className='text-center'>
									{p.outLunch !== null ? format(p.outLunch, "HH:mm") : "---"}
								</TableCell>
								<TableCell className='text-center'>
									{p.inLunch !== null ? format(p.inLunch, "HH:mm") : "---"}
								</TableCell>
								<TableCell className='text-center'>
									{p.out !== null ? format(p.out, "HH:mm") : "---"}
								</TableCell>
								<TableCell className='text-center'>
									{horasDia(p.in, p.outLunch, p.inLunch, p.out) ===
									"NaNh NaNmin"
										? ""
										: horasDia(p.in, p.outLunch, p.inLunch, p.out)}
								</TableCell>
								<TableCell className='text-center'>
									<Dialog>
										<DialogTrigger asChild>
											<Button className='bg-gray-200  py-2  h-8 '>
												Editar
											</Button>
										</DialogTrigger>

										<DialogContent className=' min-w-[500px] bg-white sm:max-w-[425px]'>
											<DialogHeader>
												<DialogTitle>Editar Ponto</DialogTitle>
												<DialogDescription className='  text-blue-700'>
													{user?.firstName} dia {p.day}
												</DialogDescription>
											</DialogHeader>
											<Form method='post'>
												<input
													hidden
													value={user.id}
													name='userId'
													id='userId'
												/>
												<input
													hidden
													value={p.in.toString()}
													name='dt'
													id='dt'
												/>
												<input hidden value={p.day} name='day' id='day' />
												<div className='grid gap-4 py-4'>
													<div className='grid grid-cols-4 items-center gap-4'>
														<Label htmlFor='in' className='text-right '>
															Entrada
														</Label>
														<Input
															type='time'
															id='in'
															name='in'
															defaultValue={format(p.in, "HH:mm")}
															className='col-span-2'
														/>
													</div>
													<div className='grid grid-cols-4 items-center gap-4'>
														<Label
															htmlFor='outLunch'
															className='text-right w-full'>
															Saida Almoço
														</Label>
														<Input
															type='time'
															id='outLunch'
															name='outLunch'
															defaultValue={
																p.outLunch !== null
																	? format(p.outLunch, "HH:mm")
																	: "---"
															}
															className='col-span-2'
														/>
													</div>
													<div className='grid grid-cols-4 items-center gap-4'>
														<Label htmlFor='inLunch' className='  text-nowrap '>
															Entrada Almoço
														</Label>
														<Input
															type='time'
															id='inLunch'
															name='inLunch'
															defaultValue={
																p.inLunch !== null
																	? format(p.inLunch, "HH:mm")
																	: "---"
															}
															className='  col-span-2'
														/>
													</div>
													<div className='grid grid-cols-4 items-center gap-4'>
														<Label htmlFor='password' className='text-right'>
															Saída
														</Label>
														<Input
															type='time'
															id='out'
															name='out'
															defaultValue={
																p.out !== null ? format(p.out, "HH:mm") : "---"
															}
															className='col-span-2'
														/>
													</div>
												</div>

												<DialogFooter>
													<DialogClose asChild>
														<Button
															type='submit'
															name='_action'
															value='save'
															className='bg-emerald-500'>
															Salvar
														</Button>
													</DialogClose>
												</DialogFooter>
											</Form>
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
