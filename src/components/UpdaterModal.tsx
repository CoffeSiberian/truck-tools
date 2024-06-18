import { useState, useEffect, useRef } from "react";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Divider,
	Chip,
} from "@nextui-org/react";

// icons
import { IconCalendarWeek, IconBrandWindows } from "@tabler/icons-react";

interface UpdateInfo {
	body: string;
	version: string;
	date: String;
}

const UpdaterModal = () => {
	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
	const isLoaded = useRef(false);

	const checkUpdateState = async () => {
		const { shouldUpdate, manifest } = await checkUpdate();

		if (shouldUpdate) {
			const splitDate = manifest?.date!.split(" ")[0];
			if (!splitDate) return;

			const date = new Date(splitDate);

			setUpdateInfo({
				body: manifest?.body!,
				version: manifest?.version!,
				date: date.toLocaleDateString(),
			});
		}
	};

	const setIsOpen = (open: boolean) => {
		if (!open) {
			setUpdateInfo(null);
		}
	};

	const onClickUpdate = async () => {
		await installUpdate();
		await relaunch();
	};

	useEffect(() => {
		if (!isLoaded.current) {
			isLoaded.current = true;
			checkUpdateState();
		}
	}, []);

	return (
		<>
			<Modal
				size="md"
				backdrop="blur"
				isOpen={updateInfo ? true : false}
				onOpenChange={setIsOpen}
			>
				<ModalContent>
					{(_onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								New version available
							</ModalHeader>
							<Divider />
							<ModalBody className="flex items-center justify-center py-1">
								<div className="mt-2 flex flex-col gap-2">
									<div className="flex justify-center gap-5">
										<Chip
											color="primary"
											radius="sm"
											startContent={<IconCalendarWeek />}
											variant="bordered"
										>
											{updateInfo?.date}
										</Chip>
										<Chip
											color="success"
											radius="sm"
											startContent={<IconBrandWindows />}
											variant="bordered"
										>
											Version: {updateInfo?.version}
										</Chip>
									</div>
									<h4>
										<b>Release notes</b>
									</h4>
									<p className="truncate whitespace-break-spaces">
										{updateInfo?.body}
									</p>
								</div>
							</ModalBody>
							<ModalFooter className="items-center justify-center gap-1">
								<Button
									color="danger"
									variant="light"
									onPress={() => setIsOpen(false)}
								>
									Cancel
								</Button>
								<Button color="success" variant="ghost" onPress={onClickUpdate}>
									Update Now
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdaterModal;
