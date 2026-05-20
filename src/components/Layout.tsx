import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type Props = {
    children: ReactNode;
};

export function Layout({ children }: Props) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <main
                style={{
                    flex: 1,
                    padding: 0,
                    background: "#0b0b0b",
                    minHeight: "100vh",
                    marginLeft: 270,
                }}
            >
                {children}
            </main>
        </div>
    );
}