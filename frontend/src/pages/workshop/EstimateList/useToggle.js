import { useCallback, useState } from 'react';

export default function useToggle(initialState) {
    const [isOpen, setIsOpen] = useState(initialState);

    const show = useCallback(() => setIsOpen(true), []);
    const hide = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    return [isOpen, toggle, show, hide];
}
