import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ActionFunction,
	redirect,
	type LoaderFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getUser, hitTimesheet } from "~/utils/user.server";
import { format, differenceInMinutes } from "date-fns";
import { Button } from "@/components/ui/button";

export const meta: MetaFunction = () => {
	return [
		{ title: "Pornto Brassaco" },
		{ name: "description", content: "Ponto Brassaco" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await requireUserId(request);
	!userId ? redirect("/login") : redirect("/");
	const user = await getUser(userId);
	return user;
};
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

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const userId = form.get("userId");
	const action = form.get("_action");
	console.log(userId, action);
	await hitTimesheet(userId, action);
	return redirect(`.`);
};

export default function Index() {
	const user = useLoaderData<typeof loader>();
	const ano = String(new Date().getFullYear());
	const mes = String(new Date().getMonth() + 1).padStart(2, "0");
	const dia = String(new Date().getDate()).padStart(2, "0");

	const pontoMesAnos = user?.timeSheet.filter((t) =>
		t.in?.includes(ano + "-" + mes)
	);

	pontoMesAnos?.map((t) => [
		t.in,
		t.outLunch,
		t.inLunch,
		t.out,
		(t.min = minutos(t.in, t.outLunch, t.inLunch, t.out)),
	]);

	const soma = pontoMesAnos?.reduce(
		(acumulador, min) => acumulador + min.min,
		0
	);

	const HorasTotalMes = Math.floor(soma / 60) + "h " + (soma % 60) + "min";

	const dayFilter = user?.timeSheet.filter(
		(d) => d.day == dia + "-" + mes + "-" + ano
	);

	function botao() {
		let title = "Entrada";
		let acao = "entrada";
		dayFilter?.map((d) => {
			if (d.in?.toString() === "") {
				title = "Entrada";
				acao = "entrada";
			} else if (d.in != "" && d.outLunch === null) {
				title = "Saída para o almoço";
				acao = "outLunch";
			} else if (d.in != "" && d.outLunch != "" && d.inLunch === null) {
				title = "Entrada do almoço";
				acao = "inLunch";
			} else if (
				d.in != "" &&
				d.outLunch != "" &&
				d.inLunch != "" &&
				d.out === null
			) {
				title = "Saída";
				acao = "out";
			}
		});
		return { title: title, action: acao };
	}

	console.log(
		dayFilter?.map((d) => d.out).toLocaleString() == "" ? false : true
	);

	return (
		<>
			<nav className='bg-slate-200 '>
				<div className='max-w-7xl mx-auto p-2 sm:px-6 lg:px-8 flex items-center justify-between'>
					<img className='w-32 lg:w-56' src='logosvg.svg' alt='logo' />
					<div className='flex items-center gap-5 p-4 '>
						{user && (
							<div className='flex gap-4'>
								{user?.firstName} {user?.lastName}
							</div>
						)}
						<div className='text-center'>
							<form action='/logout' method='post'>
								<button
									type='submit'
									className=' print:hidden rounded-xl bg-red-500 font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1'>
									Sair
								</button>
							</form>
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
					<Button
						disabled={
							dayFilter?.map((d) => d.out).toLocaleString() == "" ? false : true
						}
						variant='ghost'
						type='submit'
						name='_action'
						value={botao().action}
						className='bg-blue-500 h-11 rounded-xl text-white font-bold w-2/6  '>
						{botao().title}
					</Button>
				</Form>
			</div>
		</>
	);
}
