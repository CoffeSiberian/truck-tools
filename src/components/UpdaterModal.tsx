import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
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
	Progress,
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
	const [installError, setInstallError] = useState(false);
	const [isDownloading, setIsDownloading] = useState<number | null>(null);
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
		if (!open && (isDownloading === null || installError)) {
			setUpdateInfo(null);
		}
	};

	const getDownloadPercentage = (
		contentLength: number,
		downloaded: number
	): number => {
		if (contentLength === 0) return 0;
		const percentage = (downloaded / contentLength) * 100;

		return Math.round(percentage);
	};

	const onClickUpdate = async () => {
		if (installError) setInstallError(false);

		try {
			if (!updateInfo) return;
			const update = updateInfo.update;

			let downloaded = 0;
			let contentLength = 0;
			let persentageDownloaded = 0;

			setIsDownloading(0);
			await update.downloadAndInstall((event) => {
				switch (event.event) {
					case "Started":
						contentLength = event.data.contentLength!;
						break;
					case "Progress": {
						downloaded += event.data.chunkLength;
						const persentageCal = getDownloadPercentage(
							contentLength,
							downloaded
						);

						if (persentageDownloaded === persentageCal) {
							break;
						}

						persentageDownloaded = persentageCal;
						setIsDownloading(persentageCal);
						break;
					}
					case "Finished":
						setIsDownloading(null);
						break;
				}
			});

			await relaunch();
		} catch {
			setIsDownloading(null);
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
								<Progress
									aria-label="Downloading..."
									size="md"
									value={isDownloading || 0}
									color="success"
									showValueLabel={true}
									className={classNames(
										"max-w-md",
										isDownloading ? "" : "hidden"
									)}
								/>
							</ModalBody>
							<ModalFooter className="items-center justify-center gap-1">
								<Button
									isDisabled={
										isDownloading ? true : isDownloading === null ? false : true
									}
									color="danger"
									variant="light"
									onPress={() => setIsOpen(false)}
								>
									Cancel
								</Button>
								<Button
									isLoading={
										isDownloading ? true : isDownloading === null ? false : true
									}
									isDisabled={installError}
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
