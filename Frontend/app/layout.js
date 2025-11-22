import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext"
import { StockProvider } from "@/context/StockContext"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "StockMaster - Inventory Management",
    description: "Enterprise Inventory Management System",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <StockProvider>
                        {children}
                    </StockProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
