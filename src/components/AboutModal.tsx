import { FC } from "react";
import { open } from "@tauri-apps/api/shell";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	Avatar,
} from "@nextui-org/react";

// images
import avatar from "../static/img/s-coffe.webp";

// icons
import { IconBrandGithub } from "@tabler/icons-react";
import { IconBrandTwitch } from "@tabler/icons-react";

interface AboutModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const AboutModal: FC<AboutModalProps> = ({ isOpen, onOpenChange }) => {
	return (
		<>
			<Modal
				size="md"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(_onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Truck Tools - Preview 0.3.5
							</ModalHeader>
							<Divider />
							<ModalBody className="flex items-center justify-center py-1">
								<p>
									This is an open source application created in order to help
									Euro Truck Simulator 2 players to edit their Game Save in a
									simple and easy way for those who do not want to edit these
									codes manually.
								</p>
								<div className="mt-2 flex flex-row gap-2">
									<Avatar
										src={avatar}
										size="lg"
										name="Fernando Garrido"
										alt="Fernando Garrido"
									></Avatar>
									<div>
										<h4 className="text-large font-bold">Fernando Garrido</h4>
										<small className="text-default-500">
											Full Stack Developer
										</small>
									</div>
								</div>
							</ModalBody>
							<ModalFooter className="items-center justify-center gap-1">
								<Button
									onClick={() => open("https://github.com/CoffeSiberian")}
									variant="light"
									aria-label="github-link"
								>
									<IconBrandGithub size={30} />
									<p className="font-bold">/CoffeSiberian</p>
								</Button>
								<Button
									onClick={() => open("https://www.twitch.tv/siberiancoffe")}
									variant="light"
									aria-label="github-link"
								>
									<IconBrandTwitch size={30} />
									<p className="font-bold">/siberiancoffe</p>
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AboutModal;
