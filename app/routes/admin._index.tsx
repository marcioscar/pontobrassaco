import { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, redirect, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { getUser, getUsers } from "~/utils/user.server";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await requireUserId(request);
	!userId ? redirect("/login") : redirect("/");
	const users = await getUsers();
	const user = await getUser(userId);

	return { users, user };
};

export default function Admin() {
	const { users, user } = useLoaderData<typeof loader>();

	return (
		<>
			<nav className='bg-slate-200 '>
				<div className='max-w-7xl mx-auto p-2 sm:px-6 lg:px-8 flex items-center justify-between'>
					<img className='w-32 lg:w-56' src='/logosvg.svg' alt='logo' />
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
			<div className='mt-4 container'>
				<Table>
					<TableHeader>
						<TableRow className='bg-slate-100'>
							<TableHead className=' '>Funcionário</TableHead>
							<TableHead className=' text-center'>Ponto</TableHead>
							<TableHead className=''>Editar </TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user, index) => (
							<TableRow key={index}>
								<TableCell>{user.firstName + " " + user.lastName}</TableCell>
								<TableCell>
									<div className='text-center items-center  whitespace-nowrap'>
										<NavLink
											to={user.id}
											className=' text-white bg-slate-400/75 hover:bg-[#1da1f2]/80 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-2 py-1 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2'>
											<svg
												className='mr-2 text-white'
												xmlns='http://www.w3.org/2000/svg'
												width='10'
												height='10'
												viewBox='0 0 24 24'>
												<path
													fill='currentColor'
													d='M11 6v8h7v-2h-5v-6h-2zm10.854 7.683l1.998.159c-.132.854-.351 1.676-.652 2.46l-1.8-.905c.2-.551.353-1.123.454-1.714zm-2.548 7.826l-1.413-1.443c-.486.356-1.006.668-1.555.933l.669 1.899c.821-.377 1.591-.844 2.299-1.389zm1.226-4.309c-.335.546-.719 1.057-1.149 1.528l1.404 1.433c.583-.627 1.099-1.316 1.539-2.058l-1.794-.903zm-20.532-5.2c0 6.627 5.375 12 12.004 12 1.081 0 2.124-.156 3.12-.424l-.665-1.894c-.787.2-1.607.318-2.455.318-5.516 0-10.003-4.486-10.003-10s4.487-10 10.003-10c2.235 0 4.293.744 5.959 1.989l-2.05 2.049 7.015 1.354-1.355-7.013-2.184 2.183c-2.036-1.598-4.595-2.562-7.385-2.562-6.629 0-12.004 5.373-12.004 12zm23.773-2.359h-2.076c.163.661.261 1.344.288 2.047l2.015.161c-.01-.755-.085-1.494-.227-2.208z'
												/>
											</svg>
											Ponto
										</NavLink>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
