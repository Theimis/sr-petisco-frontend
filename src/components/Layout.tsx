import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";


type Props = {
    children: ReactNode;
};

export function Layout({ children }: Props) {

    return (
        <div style={{ display: "flex" }}>

            <Sidebar />

            <main className="layout-main"
                style={{
                    flex: 1,
                    padding: 20,
                    background: "#0C101E",
                    minHeight: "100vh",
                    marginLeft: 270,
                }}
            >


                {children}

            </main>

        </div>
    );
}

