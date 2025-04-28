import { useState } from "react";

export type UseDisclosureProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export default function useDisclosure() : UseDisclosureProps {

    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => {
        setIsOpen(true);
    }

    const onClose = () => {
        setIsOpen(false);
    }

    return { isOpen, onOpen, onClose };

}