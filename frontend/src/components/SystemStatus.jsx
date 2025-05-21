import React, { useState, useEffect } from 'react';

const SystemStatus = () => {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [lastChecked, setLastChecked] = useState(null);

    useEffect(() => {
        const checkSystemStatus = async () => {
            try {
                const response = await fetch('/api/system-status');
                const data = await response.json();
                setIsMaintenance(data.isMaintenance);
                setLastChecked(new Date());
            } catch (error) {
                console.error('Error checking system status:', error);
                // Assume maintenance mode if we can't reach the server
                setIsMaintenance(true);
            }
        };

        checkSystemStatus();
        const interval = setInterval(checkSystemStatus, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, []);

    if (!isMaintenance) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg">
            <div className="flex items-center">
                <div className="py-1">
                    <svg className="h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <p className="font-bold">System Maintenance</p>
                    <p className="text-sm">The database is currently under maintenance. Some features may be limited.</p>
                    {lastChecked && (
                        <p className="text-xs mt-1">Last checked: {lastChecked.toLocaleTimeString()}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemStatus; 