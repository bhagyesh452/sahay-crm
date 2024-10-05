import React, { useState, useEffect } from 'react';
import Nodata from '../components/Nodata';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';

function BdmMaturedCases() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [maturedCases, setMaturedCases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMaturedCases = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/company-data/bdmMaturedCases`);
            setMaturedCases(res.data.data);
            console.log("Matured cases are :", res.data.data);
        } catch (error) {
            console.log("Error fetching matured cases:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMaturedCases();
    }, []);

    return (
        <div className="modal-body">
            <div className='table table-responsive'>
                {isLoading ? (
                    <ClipLoader />
                ) : maturedCases && maturedCases.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Sr. No</th>
                                <th>BDM Name</th>
                                <th>Number</th>
                                <th>Received Cases</th>
                                <th>Matured Cases</th>
                                <th>Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maturedCases.map((item, index) => {
                                return (
                                    <tr key={item.id}>
                                        <td>-</td>
                                        <td>{index + 1}</td>
                                        <td>{item.bdmName}</td>
                                        <td>{item.bdmNumber}</td>
                                        <td>{item.receivedCases}</td>
                                        <td>{item.maturedCases}</td>
                                        <td>{item.ratio}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div>
                        <Nodata />
                    </div>
                )}
            </div>
        </div>
    );
}

export default BdmMaturedCases;