import { useState, useEffect, useRef } from "react";
import { check as checkUpdate, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
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
import AlertSave from "@/components/AlertSave";

// icons
import {
	IconCalendarWeek,
	IconBrandWindows,
	IconDownload,
} from "@tabler/icons-react";

interface UpdateInfo {
	update: Update;
	body: string;
	version: string;
	date: string;
}

const UpdaterModal = () => {
	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
	const [isInstalling, setIsInstalling] = useState(false);
	const [installError, setInstallError] = useState(false);
	const updateChecked = useRef(false);

	const checkUpdateState = async () => {
		try {
			const update = await checkUpdate();

			if (update) {
				const splitDate = update.date;
				if (!splitDate) return;

				const date = new Date(splitDate);

				setUpdateInfo({
					update: update,
					body: update.body!,
					version: update.version,
					date: date.toLocaleDateString(),
				});
			}
		} catch {
			return;
		}
	};

	const setIsOpen = (open: boolean) => {
		if (!open && !isInstalling) {
			setUpdateInfo(null);
		}
	};

	const onClickUpdate = async () => {
		if (installError) setInstallError(false);
		setIsInstalling(true);

		try {
			if (!updateInfo) return;
			const update = updateInfo.update;

			let downloaded = 0;
			let contentLength = 0;

			await update.downloadAndInstall((event) => {
				switch (event.event) {
					case "Started":
						contentLength = event.data.contentLength!;
						console.log(
							`started downloading ${event.data.contentLength} bytes`
						);
						break;
					case "Progress":
						downloaded += event.data.chunkLength;
						console.log(`downloaded ${downloaded} from ${contentLength}`);
						break;
					case "Finished":
						console.log("download finished");
						break;
				}
			});

			await relaunch();
			setIsInstalling(false);
		} catch {
			setIsInstalling(false);
			setInstallError(true);
		}
	};

	useEffect(() => {
		if (!updateChecked.current) {
			updateChecked.current = true;
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
					{() => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								New version available
							</ModalHeader>
							<Divider />
							<ModalBody className="flex items-center justify-center py-1">
								<div className="mb-2 mt-2 flex w-full flex-col gap-2">
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
								<AlertSave
									message="Installation failed. Retry Update"
									error={installError}
									show={installError}
								/>
							</ModalBody>
							<ModalFooter className="items-center justify-center gap-1">
								<Button
									isDisabled={isInstalling}
									color="danger"
									variant="light"
									onPress={() => setIsOpen(false)}
								>
									Cancel
								</Button>
								<Button
									isLoading={isInstalling}
									endContent={<IconDownload />}
									color="success"
									variant="ghost"
									onPress={onClickUpdate}
								>
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
