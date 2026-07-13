import { FormEvent, useContext, useEffect, useRef, useState } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Alert } from "@heroui/alert";
import { Spinner } from "@heroui/spinner";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import AlertSave from "@/components/AlertSave";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Utils
import {
	getProfileCompanyNameEts2,
	setProfileCompanyNameEts2,
} from "@/utils/fileEdit";

// Icons
import {
	IconBuilding,
	IconPencil,
	IconDeviceFloppy,
} from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
	message: string;
}

const ChangeCompanyName = () => {
	const { selectedProfile, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { company_name } = translations.menu_options.profile;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const loadRequestId = useRef(0);

	const [currentCompanyName, setCurrentCompanyName] = useState<string>("");
	const [companyName, setCompanyName] = useState<string>("");
	const [loadError, setLoadError] = useState<string>("");
	const [isLoadingCompanyName, setIsLoadingCompanyName] =
		useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
		message: "",
	});

	const trimmedCompanyName = companyName.trim();
	const isUnsupportedGame = game !== "ets2";
	const canSave =
		!!selectedProfile &&
		!isUnsupportedGame &&
		!isLoadingCompanyName &&
		!isSaving &&
		trimmedCompanyName.length > 0 &&
		trimmedCompanyName !== currentCompanyName;

	useEffect(() => {
		const requestId = loadRequestId.current + 1;
		loadRequestId.current = requestId;

		const loadCompanyName = async () => {
			if (!isOpen || !selectedProfile || isUnsupportedGame) {
				if (loadRequestId.current !== requestId) return;

				setCurrentCompanyName("");
				setCompanyName("");
				setLoadError("");
				setIsLoadingCompanyName(false);
				return;
			}

			setIsLoadingCompanyName(true);
			setLoadError("");

			try {
				const res = await getProfileCompanyNameEts2(selectedProfile.dir, game);
				if (loadRequestId.current !== requestId) return;

				if (!res.res || res.company_name === null) {
					setCurrentCompanyName("");
					setCompanyName("");
					setLoadError(res.error || company_name.modal.load_error);
					return;
				}

				setCurrentCompanyName(res.company_name);
				setCompanyName(res.company_name);
			} catch {
				if (loadRequestId.current !== requestId) return;
				setLoadError(company_name.modal.load_error);
			} finally {
				if (loadRequestId.current === requestId) {
					setIsLoadingCompanyName(false);
				}
			}
		};

		loadCompanyName();
	}, [
		company_name.modal.load_error,
		game,
		isOpen,
		isUnsupportedGame,
		selectedProfile,
	]);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!selectedProfile || !canSave) return;

		if (completed.completed) {
			setCompleted({ error: false, completed: false, message: "" });
		}

		setIsSaving(true);
		const res = await setProfileCompanyNameEts2(
			selectedProfile.dir,
			game,
			trimmedCompanyName
		);

		if (!res.res || res.company_name === null) {
			setCompleted({
				error: true,
				completed: true,
				message: res.error || company_name.modal.save_error,
			});
			setIsSaving(false);
			return;
		}

		setCurrentCompanyName(res.company_name);
		setCompanyName(res.company_name);
		setCompleted({
			error: false,
			completed: true,
			message: company_name.modal.save_success,
		});
		setIsSaving(false);
	};

	return (
		<>
			<Button
				endContent={<IconPencil stroke={2} />}
				onPress={onOpen}
				isDisabled={!selectedProfile || isUnsupportedGame}
				color="primary"
				variant="shadow"
			>
				{company_name.modal.btn_open}
			</Button>
			<Modal
				hideCloseButton
				size="md"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				shouldBlockScroll={false}
			>
				<ModalContent>
					{(onClose) => (
						<form onSubmit={onSubmit}>
							<ModalHeader className="flex flex-col gap-1">
								{company_name.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{company_name.modal.description}</p>

								{isUnsupportedGame ? (
									<Alert
										color="warning"
										description={company_name.modal.unsupported_game}
										isVisible={true}
									/>
								) : null}

								{loadError ? (
									<Alert
										color="danger"
										description={loadError}
										isVisible={true}
									/>
								) : null}

								<div className="flex flex-col gap-3">
									<Input
										className="mt-1"
										startContent={<IconBuilding />}
										label={company_name.modal.current_company_name}
										value={currentCompanyName}
										variant="bordered"
										isReadOnly
										isDisabled={isLoadingCompanyName || isSaving || !!loadError}
										endContent={
											isLoadingCompanyName ? <Spinner size="sm" /> : null
										}
									/>
									<Input
										startContent={<IconBuilding />}
										isInvalid={
											!isLoadingCompanyName && trimmedCompanyName === ""
										}
										label={company_name.modal.input_company_name.label}
										placeholder={
											company_name.modal.input_company_name.placeholder
										}
										value={companyName}
										onValueChange={setCompanyName}
										variant="bordered"
										isDisabled={
											!selectedProfile ||
											isUnsupportedGame ||
											isLoadingCompanyName ||
											isSaving ||
											!!loadError
										}
									/>
								</div>

								<AlertSave
									message={completed.message}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({
											error: completed.error,
											completed: false,
											message: completed.message,
										})
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
									isDisabled={isSaving}
								>
									{company_name.modal.btn_close}
								</Button>
								<Button
									type="submit"
									endContent={<IconDeviceFloppy />}
									isLoading={isSaving}
									isDisabled={!canSave}
									color="success"
								>
									{company_name.modal.btn_apply}
								</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ChangeCompanyName;
