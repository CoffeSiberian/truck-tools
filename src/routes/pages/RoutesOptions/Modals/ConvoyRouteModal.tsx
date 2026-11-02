import { useState, useContext } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
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
import { setCustomRoute as setCustomRouteSave } from "@/utils/fileEdit";

// Icons
import {
	IconShare,
	IconCheck,
	IconAlertCircle,
	IconRoute,
} from "@tabler/icons-react";

// Types
import { CustomRoutePayload } from "@/types/fileEditTypes";

interface CompletedProps {
	error: boolean;
	completed: boolean;
	message?: string;
}

const ConvoyRouteModal = () => {
	const { selectedSave, game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { convoy_share } = translations.menu_options.routes;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [inputCode, setInputCode] = useState<string>("");
	const [parsedRoute, setParsedRoute] = useState<CustomRoutePayload | null>(
		null
	);
	const [parseError, setParseError] = useState<string>("");
	const [isApplying, setIsApplying] = useState<boolean>(false);
	const [completed, setCompleted] = useState<CompletedProps>({
		error: false,
		completed: false,
	});

	const handleCodeChange = (code: string) => {
		setInputCode(code);
		setParseError("");
		setParsedRoute(null);

		const trimmed = code.trim();
		if (!trimmed) return;

		try {
			const jsonStr = atob(trimmed);
			const parsed = JSON.parse(jsonStr) as CustomRoutePayload;

			if (parsed.game && parsed.game !== game) {
				setParseError(convoy_share.modal.other_game_code);
			} else if (parsed.source_city && parsed.target_city && parsed.cargo) {
				setParsedRoute(parsed);
			} else {
				setParseError(convoy_share.modal.invalid_code);
			}
		} catch {
			setParseError(convoy_share.modal.invalid_code);
		}
	};

	const applyConvoyRoute = async () => {
		if (!selectedSave || !parsedRoute) return;

		setIsApplying(true);
		setCompleted({ error: false, completed: false });

		const res = await setCustomRouteSave(
			selectedSave.dir,
			{
				...parsedRoute,
				apply_mode: "offer",
				start_mode: "offer",
			},
			game
		);

		setIsApplying(false);
		setCompleted({
			error: !res,
			completed: true,
			message: res
				? "¡Ruta de Convoy aplicada con éxito!"
				: "Error al aplicar la ruta de convoy a la partida.",
		});
	};

	return (
		<>
			<Button
				endContent={<IconShare stroke={2} />}
				onPress={onOpen}
				isDisabled={!selectedSave}
				color="primary"
				variant="shadow"
			>
				{convoy_share.modal.btn_open}
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
								<IconShare className="text-primary" size={24} />
								<span className="text-lg font-bold">
									{convoy_share.modal.title}
								</span>
							</ModalHeader>

							<ModalBody className="gap-4 py-4">
								<p className="text-default-500 text-sm">
									{convoy_share.modal.description}
								</p>

								<AlertSave
									message={completed.message || ""}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({ error: false, completed: false })
									}
								/>

								<div className="flex flex-col gap-2">
									<Input
										label={convoy_share.modal.input_code_label}
										placeholder={convoy_share.modal.input_code_placeholder}
										value={inputCode}
										onValueChange={handleCodeChange}
										variant="bordered"
										isInvalid={Boolean(parseError)}
										errorMessage={parseError}
									/>
								</div>

								{parsedRoute && (
									<Card className="border-success/40 from-success/10 via-success/5 border bg-gradient-to-r to-transparent shadow-sm">
										<CardBody className="flex flex-col gap-2 p-4">
											<div className="text-success flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
												<IconCheck size={16} />
												<span>Ruta de Convoy Detectada</span>
											</div>
											<div className="flex items-center gap-2 text-sm font-semibold">
												<span className="text-default-700">
													{parsedRoute.source_city
														.replace(/_/g, " ")
														.toUpperCase()}{" "}
													({parsedRoute.source_company || "Empresa"})
												</span>
												<span className="text-success">➔</span>
												<span className="text-default-700">
													{parsedRoute.target_city
														.replace(/_/g, " ")
														.toUpperCase()}{" "}
													({parsedRoute.target_company || "Empresa"})
												</span>
											</div>
											<div className="flex flex-wrap items-center gap-2 pt-1">
												<Chip size="sm" variant="flat" color="warning">
													Carga:{" "}
													{parsedRoute.cargo.replace(/_/g, " ").toUpperCase()} (
													{parsedRoute.units_count || 24} u)
												</Chip>
												<Chip size="sm" variant="flat" color="secondary">
													Distancia: ~{parsedRoute.distance_km || 400} km
												</Chip>
												<Chip size="sm" variant="flat" color="primary">
													Oferta en Bolsa
												</Chip>
											</div>
										</CardBody>
									</Card>
								)}

								<Warning
									text={
										<div className="flex items-center gap-2 text-xs">
											<IconAlertCircle size={16} />
											<span>
												Todos los jugadores en el convoy deben tener los mismos
												mapas o DLCs donde se ubiquen las ciudades de origen y
												destino.
											</span>
										</div>
									}
								/>
							</ModalBody>

							<ModalFooter className="border-default-200 border-t">
								<Button color="danger" variant="light" onPress={onClose}>
									{convoy_share.modal.btn_close}
								</Button>
								<Button
									endContent={<IconRoute size={18} />}
									isLoading={isApplying}
									isDisabled={!parsedRoute || isApplying}
									color="success"
									onPress={applyConvoyRoute}
								>
									{convoy_share.modal.btn_import}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ConvoyRouteModal;
