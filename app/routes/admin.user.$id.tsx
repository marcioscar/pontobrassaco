import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Modal from "~/components/Modal";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
	return null;
};

export default function RouteComponent() {
	const data = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	function closeHandler() {
		navigate("..");
	}
	return (
		<Modal onClose={closeHandler}>
			<div>USUARIO</div>
		</Modal>
	);
}
