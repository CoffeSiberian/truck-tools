import { useState, useContext } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import AlertSave from "@/components/AlertSave";
import Warning from "@/components/Warning";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Utils
import {
	getSaveGameRouteData,
	cancelCurrentJob as cancelJobSave,
} from "@/utils/fileEdit";

// Icons
import {
	IconTrash,
	IconCircleCheck,
	IconAlertTriangle,
} from "@tabler/icons-react";

// Types
import { CurrentJobInfo } from "@/types/fileEditTypes";

interface CompletedProps {
	error: boolean;
	completed: boolean;
	message?: string;
}

const CancelJobModal = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { cancel_job } = translations.menu_options.routes;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeJob, setActiveJob] = useState<CurrentJobInfo | null>(null);
	const [isCancelling, setIsCancelling] = useState<boolean>(false);
	const [completed, setCompleted] = useState<CompletedProps>({
		error: false,
		completed: false,
	});

	const fetchJobData = async () => {
		if (!selectedSave) return;
		setIsLoading(true);
		const data = await getSaveGameRouteData(selectedSave.dir, game);
		setIsLoading(false);
		if (data && data.current_job) {
			setActiveJob(data.current_job);
		} else {
			setActiveJob(null);
		}
	};

	const handleOpen = () => {
		onOpen();
		fetchJobData();
	};

	const onCancelJob = async () => {
		if (!selectedSave) return;
		setIsCancelling(true);
		setCompleted({ error: false, completed: false });

		const res = await cancelJobSave(selectedSave.dir);

		setIsCancelling(false);
		setCompleted({
			error: !res,
			completed: true,
			message: res
				? cancel_job.modal.success_message
				: cancel_job.modal.error_message,
		});

		if (res) {
			setActiveJob(null);
		}
	};

	return (
		<>
			<Button
				endContent={<IconTrash stroke={2} />}
				onPress={handleOpen}
				isDisabled={!selectedSave}
				color="danger"
				variant="shadow"
			>
				{cancel_job.modal.btn_open}
			</Button>

			<Modal
				size="2xl"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="border-default-200 flex items-center gap-2 border-b">
								<IconTrash className="text-danger" size={24} />
								<span className="text-lg font-bold">
									{cancel_job.modal.title}
								</span>
							</ModalHeader>

							<ModalBody className="gap-4 py-4">
								<p className="text-default-500 text-sm">
									{cancel_job.modal.description}
								</p>

								<AlertSave
									message={completed.message || ""}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({ error: false, completed: false })
									}
								/>

								{isLoading ? (
									<div className="flex justify-center py-6">
										<Spinner size="md" color="danger" />
									</div>
								) : activeJob ? (
									<Card className="border-danger/40 from-danger/10 via-danger/5 border bg-gradient-to-r to-transparent shadow-sm">
										<CardBody className="flex flex-col gap-2 p-4">
											<span className="text-danger text-xs font-bold tracking-wider uppercase">
												{cancel_job.modal.active_job_info}
											</span>
											<div className="flex items-center gap-2 text-sm font-semibold">
												<span className="text-default-700">
													{activeJob.source_city
														?.replace(/_/g, " ")
														.toUpperCase() || "Ciudad"}{" "}
													({activeJob.source_company || "Empresa"})
												</span>
												<span className="text-danger">➔</span>
												<span className="text-default-700">
													{activeJob.target_city
														?.replace(/_/g, " ")
														.toUpperCase() || "Ciudad"}{" "}
													({activeJob.target_company || "Empresa"})
												</span>
											</div>
											<div className="flex flex-wrap items-center gap-2 pt-1">
												<Chip size="sm" variant="flat" color="warning">
													Carga:{" "}
													{activeJob.cargo?.replace(/_/g, " ").toUpperCase() ||
														"Carga"}
												</Chip>
												{activeJob.distance_km > 0 && (
													<Chip size="sm" variant="flat" color="secondary">
														Distancia: {activeJob.distance_km} km
													</Chip>
												)}
											</div>
										</CardBody>
									</Card>
								) : (
									<div className="bg-default-100 text-default-600 flex items-center gap-2 rounded-xl p-4 text-sm">
										<IconCircleCheck className="text-success" size={20} />
										<span>{cancel_job.modal.no_active_job}</span>
									</div>
								)}

								<Warning
									text={
										<div className="flex items-center gap-2 text-xs">
											<IconAlertTriangle size={16} />
											<span>
												Al cancelar el trabajo en la partida, el juego no te
												cobrará ninguna penalización económica ni afectará tus
												estadísticas.
											</span>
										</div>
									}
								/>
							</ModalBody>

							<ModalFooter className="border-default-200 border-t">
								<Button color="default" variant="light" onPress={onClose}>
									{cancel_job.modal.btn_close}
								</Button>
								<Button
									endContent={<IconTrash size={18} />}
									isLoading={isCancelling}
									isDisabled={!activeJob || isCancelling}
									color="danger"
									onPress={onCancelJob}
								>
									{cancel_job.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default CancelJobModal;
