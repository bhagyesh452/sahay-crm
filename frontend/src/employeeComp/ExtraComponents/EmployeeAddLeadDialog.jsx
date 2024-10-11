import React ,{useState , useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import axios from 'axios';
import { TiUserAddOutline } from "react-icons/ti";

function EmployeeAddLeadDialog({
    secretKey,
    fetchData,
    ename,
    fetchNewData
}) {
    const [openNew, openchangeNew] = useState(false);
    const [errorDirectorNumberFirst, setErrorDirectorNumberFirst] = useState("")
    const [errorDirectorNumberSecond, setErrorDirectorNumberSecond] = useState("")
    const [errorDirectorNumberThird, setErrorDirectorNumberThird] = useState("")
    const [openSecondDirector, setOpenSecondDirector] = useState(false);
    const [openFirstDirector, setOpenFirstDirector] = useState(true);
    const [openThirdDirector, setOpenThirdDirector] = useState(false);
    const [firstPlus, setFirstPlus] = useState(true);
    const [secondPlus, setSecondPlus] = useState(false);
    const [openThirdMinus, setOpenThirdMinus] = useState(false);
    const [cname, setCname] = useState("");
    const [cemail, setCemail] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [directorNameFirst, setDirectorNameFirst] = useState("");
    const [directorNameSecond, setDirectorNameSecond] = useState("");
    const [directorNameThird, setDirectorNameThird] = useState("");
    const [directorNumberFirst, setDirectorNumberFirst] = useState(0);
    const [directorNumberSecond, setDirectorNumberSecond] = useState(0);
    const [directorNumberThird, setDirectorNumberThird] = useState(0);
    const [directorEmailFirst, setDirectorEmailFirst] = useState("");
    const [directorEmailSecond, setDirectorEmailSecond] = useState("");
    const [directorEmailThird, setDirectorEmailThird] = useState("");
    const [cnumber, setCnumber] = useState(0);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [cidate, setCidate] = useState(null);

    const functionopenpopupNew = () => {
        openchangeNew(true);
    };
    const closepopupNew = () => {
        openchangeNew(false);
        setOpenFirstDirector(true);
        setOpenSecondDirector(false);
        setOpenThirdDirector(false);
        setFirstPlus(true);
        setSecondPlus(false);
        setOpenThirdMinus(false)
        fetchData();
        setErrorDirectorNumberFirst("");
        setErrorDirectorNumberSecond("");
        setErrorDirectorNumberThird("");
    };

    const debouncedSetCname = debounce((value) => {
        setCname(value);
    }, 10);

    const debouncedSetEmail = debounce((value) => {
        setCemail(value);
    }, 10);

    const debouncedSetAddress = debounce((value) => {
        setCompanyAddress(value);
    }, 10);

    const debouncedSetIncoDate = debounce((value) => {
        setCidate(value);
    }, 10);

    const [errorCNumber, setErrorCNumber] = useState('');

    const debouncedSetCompanyNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setCnumber(value);
            setErrorCNumber('');
        } else {
            setErrorCNumber('Please enter a 10-digit number');
            setCnumber()
        }

    }, 10);

    const debouncedSetCity = debounce((value) => {
        setCity(value);
    }, 10);

    const debouncedSetState = debounce((value) => {
        setState(value);
    }, 10);

    const debounceSetFirstDirectorName = debounce((value) => {
        setDirectorNameFirst(value);
    }, 10);

    
    const functionOpenSecondDirector = () => {
        setOpenSecondDirector(true);
        setFirstPlus(false);
        setSecondPlus(true);
    };
    const functionOpenThirdDirector = () => {
        setOpenSecondDirector(true);
        setOpenThirdDirector(true);
        setFirstPlus(false);
        setSecondPlus(false);
        setOpenThirdMinus(true);
    };

    const functionCloseSecondDirector = () => {
        setOpenFirstDirector(false);
        //setOpenThirdMinus(true);
        setOpenThirdMinus(false);
        setOpenSecondDirector(false);
        setSecondPlus(false);
        setFirstPlus(true);
    };
    const functionCloseThirdDirector = () => {
        setOpenSecondDirector(true);
        setOpenThirdDirector(false);
        setFirstPlus(false);
        setOpenThirdMinus(false);
        setSecondPlus(true);
    };


    const debounceSetFirstDirectorNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setDirectorNumberFirst(value)
            setErrorDirectorNumberFirst("")
        } else {
            setErrorDirectorNumberFirst('Please Enter 10 digit Number')
            setDirectorNumberFirst()
        }
    }, 10);

    const debounceSetFirstDirectorEmail = debounce((value) => {
        setDirectorEmailFirst(value);
    }, 10);

    const debounceSetSecondDirectorName = debounce((value) => {
        setDirectorNameSecond(value);
    }, 10);

    const debounceSetSecondDirectorNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setDirectorNumberSecond(value)
            setErrorDirectorNumberSecond("")
        } else {
            setErrorDirectorNumberSecond('Please Enter 10 digit Number')
            setDirectorNumberSecond()
        }
    }, 10);

    const debounceSetSecondDirectorEmail = debounce((value) => {
        setDirectorEmailSecond(value);
    }, 10);

    const debounceSetThirdDirectorName = debounce((value) => {
        setDirectorNameThird(value);
    }, 10);

    const debounceSetThirdDirectorNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setDirectorNumberThird(value)
            setErrorDirectorNumberThird("")
        } else {
            setErrorDirectorNumberThird('Please Enter 10 digit Number')
            setDirectorNumberThird()
        }
    }, 10);

    const debounceSetThirdDirectorEmail = debounce((value) => {
        setDirectorEmailThird(value);
    }, 10);

    const handleSubmitData = async (e) => {

        e.preventDefault();
        if (cname === "") {
            Swal.fire("Please Enter Company Name");
        }
        else if (!cnumber && !/^\d{10}$/.test(cnumber)) {
            Swal.fire("Company Number is required");
        } else if (cemail === "") {
            Swal.fire("Company Email is required");
        } else if (city === "") {
            Swal.fire("City is required");
        } else if (state === "") {
            Swal.fire("State is required");
        } else if (directorNumberFirst !== 0 && !/^\d{10}$/.test(directorNumberFirst)) {
            Swal.fire("First Director Number should be 10 digits");
        } else if (directorNumberSecond !== 0 && !/^\d{10}$/.test(directorNumberSecond)) {
            Swal.fire("Second Director Number should be 10 digits");
        } else if (directorNumberThird !== 0 && !/^\d{10}$/.test(directorNumberThird)) {
            Swal.fire("Third Director Number should be 10 digits");
        } else {
            const dataToSend = {
                "Company Name": cname.toUpperCase().trim(),
                "Company Number": cnumber,
                "Company Email": cemail,
                "Company Incorporation Date  ": cidate, // Assuming the correct key is "Company Incorporation Date"
                City: city,
                State: state,
                ename: ename,
                AssignDate: new Date(),
                "Company Address": companyAddress,
                "Director Name(First)": directorNameFirst,
                "Director Number(First)": directorNumberFirst,
                "Director Email(First)": directorEmailFirst,
                "Director Name(Second)": directorNameSecond,
                "Director Number(Second)": directorNumberSecond,
                "Director Email(Second)": directorEmailSecond,
                "Director Name(Third)": directorNameThird,
                "Director Number(Third)": directorNumberThird,
                "Director Email(Third)": directorEmailThird,
                "UploadedBy": ename
            }
            await axios.post(`${secretKey}/requests/requestCompanyData`, dataToSend).then((response) => {
                //console.log("response", response);

                Swal.fire({
                    title: "Lead Request Sent!",
                    text: "Your Request has been sent to the Data Manager!",
                    html: 'Data Analyst Details:<br>Name: PavanSinh Vaghela<br>Number: 9998954896',
                    icon: "success",
                });
                fetchNewData();
                closepopupNew();
            })
                .catch((error) => {
                    console.error("Error sending data:", error);
                    Swal.fire({
                        title: "This lead already exists in the Start-Up Sahay's database.",
                        text: "For further assistance, please contact the Data Analyst.",
                        html: `Data Analyst Details:<br>Name: PavanSinh Vaghela<br>Number: 9998954896`,
                    });
                });
            
        }
    };

    return (
        <div className="btn-group mr-2">
            <button type="button" className="btn mybtn"
                onClick={functionopenpopupNew}
            >
                <TiUserAddOutline className='mr-1' /> Add Leads
            </button>
            {/* --------------------------dialog to add leads individually-------------------------------------------- */}
            <Dialog className='My_Mat_Dialog' open={openNew} onClose={closepopupNew} fullWidth maxWidth="md">
                <DialogTitle>
                    Company Info{" "}
                    <button onClick={closepopupNew} style={{ float: "right",backgroundColor:"transparent",border:"none" }}>
                        <IoClose color="primary">
                        </IoClose>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Your Company Name"
                                                onChange={(e) => {
                                                    debouncedSetCname(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Number <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                placeholder="Enter Company's Phone No."
                                                onChange={(e) => {
                                                    debouncedSetCompanyNumber(e.target.value);
                                                }}
                                                className="form-control"
                                            />
                                            {errorCNumber && <p style={{ color: 'red' }}>{errorCNumber}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Email <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => {
                                                    debouncedSetEmail(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Company Incorporation Date
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    debouncedSetIncoDate(e.target.value);
                                                }}
                                                type="date"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">City<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                onChange={(e) => {
                                                    debouncedSetCity(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Your City"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">State<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                onChange={(e) => {
                                                    debouncedSetState(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Your State"
                                            //disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Company Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Enter Your Address"
                                                onChange={(e) => {
                                                    debouncedSetAddress(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Director's Name(First)
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Your Company Name"
                                                onChange={(e) => {
                                                    debounceSetFirstDirectorName(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Director's Number(First)
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => {
                                                    debounceSetFirstDirectorNumber(e.target.value);
                                                }}
                                            />
                                            {errorDirectorNumberFirst && <p style={{ color: 'red' }}>{errorDirectorNumberFirst}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Director's Email(First)
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => {
                                                    debounceSetFirstDirectorEmail(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {firstPlus && (
                                    <div className="d-flex align-items-center justify-content-end gap-2">
                                        <button
                                            onClick={() => {
                                                functionOpenSecondDirector();
                                            }}
                                            className="btn btn-primary d-none d-sm-inline-block"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 5l0 14" />
                                                <path d="M5 12l14 0" />
                                            </svg>
                                        </button>

                                    </div>
                                )}

                                {openSecondDirector && (
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Name(Second)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="Your Company Name"
                                                    onChange={(e) => {
                                                        debounceSetSecondDirectorName(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Number(Second)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetSecondDirectorNumber(e.target.value);
                                                    }}
                                                />
                                                {errorDirectorNumberSecond && <p style={{ color: 'red' }}>{errorDirectorNumberSecond}</p>}
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Email(Second)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetSecondDirectorEmail(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {secondPlus && (
                                    <div className="d-flex align-items-center justify-content-end gap-2">
                                        <button
                                            onClick={() => {
                                                functionOpenThirdDirector();
                                            }}
                                            className="btn btn-primary d-none d-sm-inline-block"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 5l0 14" />
                                                <path d="M5 12l14 0" />
                                            </svg>
                                        </button>
                                        <button
                                            className="btn btn-primary d-none d-sm-inline-block"
                                            onClick={() => {
                                                functionCloseSecondDirector();
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                fill="white"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {openThirdDirector && (
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Name(Third)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="Your Company Name"
                                                    onChange={(e) => {
                                                        debounceSetThirdDirectorName(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Number(Third)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetThirdDirectorNumber(e.target.value);
                                                    }}
                                                />
                                                {errorDirectorNumberThird && <p style={{ color: 'red' }}>{errorDirectorNumberThird}</p>}
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Email(Third)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetThirdDirectorEmail(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {openThirdMinus && (
                                    <button
                                        className="btn btn-primary d-none d-sm-inline-block"
                                        style={{ float: "right" }}
                                        onClick={() => {
                                            functionCloseThirdDirector();
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon"
                                            width="24"
                                            height="24"
                                            fill="white"
                                            viewBox="0 0 448 512"
                                        >
                                            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <button className="btn btn-primary bdr-radius-none" onClick={handleSubmitData}>
                    Submit
                </button>
            </Dialog>
        </div>
    )
}

export default EmployeeAddLeadDialog