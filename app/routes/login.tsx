import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getUser, login, register } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return (await getUser(request)) ? redirect("/") : null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const form = await request.formData();

	const action = form.get("_action");
	const email = form.get("email") as string;
	const password = form.get("password") as string;
	let firstName = form.get("firstName");
	let lastName = form.get("lastName");

	switch (action) {
		case "login": {
			// return await login({ email, password });
			const user = await login(email, password);
			if (!user) {
				return badRequest({
					formError: `Usuário ou senha inválidos`,
				});
			}

			return user;
		}
		case "register": {
			firstName = firstName as string;
			lastName = lastName as string;
			return await register({ email, password, firstName, lastName });
		}
		// default:
		//   return json({ error: `Dados Inválidos` }, { status: 401 });
	}
};
const badRequest = (data) => json(data, { status: 400 });
export default function Login() {
	const data = useLoaderData<typeof loader>();
	const [action, setAction] = useState("login");
	return (
		<div className=' h-screen w-full bg-slate-100 justify-center items-center flex flex-col gap-y-4'>
			<button
				onClick={() => setAction(action == "login" ? "register" : "login")}
				className='absolute top-8 right-8 rounded-xl bg-cyan-600 font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1'>
				{action === "login" ? "Registrar" : "Entrar"}
			</button>
			<img className='w-40 lg:w-56' src='logosvg.svg' alt='logo' />

			<p className='font-semibold text-slate-600'>
				{action === "login"
					? "Entre para registrar o ponto"
					: "Cadastre-se para Entrar"}
			</p>

			<form method='POST' className='rounded-2xl bg-gray-200 p-6 w-96'>
				<label htmlFor='email' className='text-blue-600 '>
					Email
				</label>
				<input
					className='w-full p-2 rounded-xl my-2'
					type='text'
					name='email'
					defaultValue={data?.email}
				/>

				<label htmlFor='password' className='text-blue-600 '>
					Senha
				</label>
				<input
					className='w-full p-2 rounded-xl my-2'
					type='password'
					name='password'
				/>

				{action === "register" && (
					<>
						<label htmlFor='firstName' className='text-blue-600 '>
							Nome
						</label>
						<input
							className='w-full p-2 rounded-xl my-2'
							type='text'
							name='firstName'
							required
						/>

						<label htmlFor='lastName' className='text-blue-600 '>
							Sobrenome
						</label>
						<input
							className='w-full p-2 rounded-xl my-2'
							type='text'
							name='lastName'
							required
						/>
					</>
				)}
				<div className='w-full text-center'>
					<button
						type='submit'
						name='_action'
						value={action}
						className='rounded-xl mt-2 bg-cyan-600 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1'>
						{action === "login" ? "Entrar" : "Cadastrar"}
					</button>
				</div>
				<div className='flex items-center justify-center '>
					{data?.formError ? (
						<p className='text-red-600 mt-2  p-2 bg-yellow-200 rounded-xl '>
							{data.formError}
						</p>
					) : null}
				</div>
			</form>
		</div>
	);
}
