import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { DarkModeContex } from "@/hooks/useDarkModeContex";
import classNames from "classnames";
import { check as checkUpdate, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { open } from "@tauri-apps/plugin-shell";
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
import { format as formatDate } from "@formkit/tempo";
import AlertSave from "@/components/AlertSave";

// icons
import {
	IconCalendarWeek,
	IconBrandWindows,
	IconDownload,
	IconExternalLink,
} from "@tabler/icons-react";

interface UpdateInfo {
	update: Update;
	body: string;
	version: string;
	date: string;
}

const UpdaterModal = () => {
	const { darkMode } = useContext(DarkModeContex);

	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
	const [installError, setInstallError] = useState(false);
	const [isDownloading, setIsDownloading] = useState<number | null>(null);
	const updateChecked = useRef(false);

	const getDate = (date: string): string => {
		try {
			const dateSplit = date.split(" ");
			const timeZoneSplit = dateSplit[2].split(":");

			const dateC = dateSplit[0];
			const time = dateSplit[1].replace(".0", "");
			const timeZone = `${timeZoneSplit[0]}:${timeZoneSplit[1]}`;

			const completeDate = `${dateC}T${time}${timeZone}`;

			return formatDate(completeDate, {
				date: "medium",
				time: "short",
			});
		} catch {
			return "";
		}
	};

	const checkUpdateState = useCallback(async () => {
		try {
			const update = await checkUpdate();

			if (update) {
				if (!update.date) return;

				const date = getDate(update.date);

				setUpdateInfo({
					update: update,
					body: update.body!,
					version: update.version,
					date: date,
				});
			}
		} catch {
			return;
		}
	}, []);

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
	}, [checkUpdateState]);

	return (
		<>
			<Modal
				size="md"
				backdrop="blur"
				isOpen={updateInfo ? true : false}
				onOpenChange={setIsOpen}
				shouldBlockScroll={false}
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
											color="secondary"
											radius="sm"
											startContent={<IconCalendarWeek stroke={1.6} />}
											variant="solid"
										>
											<b>{updateInfo?.date}</b>
										</Chip>
										<Chip
											className={classNames(
												"text-white",
												darkMode ? "bg-fuchsia-600" : "bg-fuchsia-500"
											)}
											radius="sm"
											startContent={<IconBrandWindows stroke={1.6} />}
											variant="solid"
										>
											Version: <b>{updateInfo?.version}</b>
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
									message="Installation failed. Try again later"
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
								<Button
									className={classNames(installError ? "" : "hidden")}
									endContent={<IconExternalLink />}
									color="danger"
									variant="solid"
									onPress={() =>
										open(
											"https://github.com/CoffeSiberian/truck-tools/releases/latest"
										)
									}
								>
									<b>Manual Update</b>
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
