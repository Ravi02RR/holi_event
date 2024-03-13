// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Qrreader = () => {
    const [scanResult, setScanResult] = useState(null);
    const [userExists, setUserExists] = useState(false);
    const scannerRef = useRef(null);


    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250
            },
            fps: 5
        });

        scannerRef.current.render(onScanResult, console.warn);

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, []);

    const onScanResult = async (result) => {
        setScanResult(result);
        try {
            const response = await axios.post('/api/verify-user', { regNo: result });
            setUserExists(response.status === 200);
        } catch (error) {
            console.error('Error verifying user:', error);
            setUserExists(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            const response = await axios.post('/api/checkin/add-user', { regNo: scanResult });
            if (response.status === 201) {
                toast.success(response.data.message || 'User checked in successfully');

            }
        } catch (error) {
            console.error('Error checking in user:', error);
            toast.error(error.response.data.error || 'Error checking in user');
        }
    };

    return (
        <div className="qr-container">
            <h1>QR Code Scanner</h1>
            <div className="scanner-container">
                <div id="reader" className="qr-scanner"></div>
                <ToastContainer />
                {scanResult ? (
                    userExists ? (
                        <button onClick={handleCheckIn} className="check-in-btn">Check In</button>
                    ) : (
                        <p className="error-msg">User does not exist</p>
                    )
                ) : (
                    <p className="scan-msg">Please scan the QR code</p>
                )}
            </div>
        </div>
    );
};

export default Qrreader;
