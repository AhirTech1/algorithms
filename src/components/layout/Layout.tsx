import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, MobileMenuButton } from './Sidebar';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Sidebar - fixed position */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area - offset by sidebar on desktop */}
            <div className="lg:ml-[280px] min-h-screen flex flex-col">
                {/* Mobile menu button */}
                <MobileMenuButton onClick={() => setSidebarOpen(true)} />

                {/* Page content - centered in remaining space */}
                <main className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-16 lg:pt-8">
                    <div className="w-full max-w-5xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
