import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';




const IndustryDropdown = ({ mainStatus, industry, setNewSubStatus, companyName, serviceName, refreshData, onIndustryChange }) => {
    const [status, setStatus] = useState(industry || "");
    const [statusClass, setStatusClass] = useState("created-status");
    const [options, setOptions] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    
   
    const aeronauticsOptions = [
        "Drones",
        "Space Technology",
        "Defence Equipment",
        "Aviation & Others",
        "Others"
    ];

    const airportOptions = ["Others"]
    const Advertising = [
        'AdTech',
        'Online Classified',
        'Others'
    ];
    const agricultureOptions = [
        "Dairy Farming",
        "Organic Agriculture",
        "Agri-Tech",
        "Food Processing",
        "Horticulture",
        "Fisheries",
        "Animal Husbandry",
        "Others"
    ];
    const AI = [
        'Machine Learning',
        'NLP',
        'Others'
    ];

    const analytics = [
        'Business Intelligence',
        'Big Data',
        'Data Science',
        'Others'
    ];

    const animation = ["Others"]
    const virtualReality = ["Others"]
    const architecture = ["Others"]
    const art = [
        'Handicraft',
        'Art',
        'Photography',
        'Others'
    ];

    const automotive = [
        'Auto & Truck Manufacturers',
        'Auto, Truck & Motorcycle Parts',
        'Tires & Rubber Products',
        'Electric Vehicles',
        'Others'
    ];

    const chemical = [
        'Commodity Chemicals',
        'Agricultural Chemicals',
        'Specialty Chemicals',
        'Diversified Chemicals',
        'Others'
    ];

    const telecommunication = [
        'Wireless',
        'Integrated Communication Services',
        'Network Technology Solutions',
        'Others'
    ];

    const computerVision = ["Others"]

    const construction = [
        'New-age Construction Technologies',
        'Construction Materials',
        'Construction & Engineering',
        'Construction Supplies & Fixtures',
        'Homebuilding',
        'Others'
    ];

    //const communication = ["others"]

    const dating = ["Others"]

    const design = [
        'Web Design',
        'Industrial Design',
        'Others'
    ];

    const education = [
        'E-learning',
        'Education Technology',
        'Skill Development',
        'Coaching',
        'Others'
    ];

    const nonRenewableEnergy = [
        'Oil & Gas Exploration and Production',
        'Oil & Gas Drilling',
        'Oil Related Services and Equipment',
        'Oil & Gas Transportation Services',
        'Others'
    ];

    const renewableEnergy = [
        'Renewable Solar Energy',
        'Renewable Wind Energy',
        'Renewable Nuclear Energy',
        'Renewable Energy Solutions',
        'Manufacture of Machinery and Equipment',
        'Manufacture of Electrical Equipment',
        'Others'
    ];
    const greenTechnology = [
        'Waste Management',
        'Clean Tech',
        'Others'
    ];

    const wasteManagement = ["Others"]

    const biotechnology = ["Others"]

    const enterpriseSoftware = [
        'Cloud',
        'ERP',
        'CXM',
        'SCM',
        'Customer Support',
        'Collaboration',
        'Location Based',
        'Enterprise Mobility',
        'Others'
    ];
    const events = [
        'Weddings',
        'Event Management',
        'Others'
    ];

    const fashion = [
        'Fashion Technology',
        'Lifestyle',
        'Apparel',
        'Fan Merchandise',
        'Jewellery',
        'Others'
    ];

    const food = [
        'Restaurants',
        'Food Processing',
        'Microbrewery',
        'Food Technology/Food Delivery',
        'Others'
    ];

    const internet = [
        'Smart Home',
        'Manufacturing & Warehouse',
        'Wearables',
        'Others'
    ];

    const finance = [
        'Crowdfunding',
        'Mobile Wallets/Payments',
        'Point of Sales',
        'Payment Platforms',
        'Trading',
        'Billing and Invoicing',
        'Personal Finance',
        'Insurance',
        'Advisory',
        'Business Finance',
        'P2P Lending',
        'Bitcoin and Blockchain',
        'Microfinance',
        'Foreign Exchange',
        'Accounting',
        'Others'
    ];

    const hardware = [
        'Embedded',
        'Semiconductor',
        'Electronics',
        '3D Printing',
        'Manufacturing',
        'Others'
    ];

    const healthcare = [
        'Assistance Technology',
        'Medical Devices/Biomedical',
        'Health & Wellness',
        'Pharmaceutical',
        'Biotechnology',
        'Healthcare Services',
        'Healthcare IT',
        'Healthcare Technology',
        'Others'
    ];

    const humanResource = [
        'Recruitment/Jobs',
        'Training',
        'Skills Assessment',
        'Talent Management',
        'Internships',
        'Others'
    ];

    const itServices = [
        'IT Consulting',
        'BPO',
        'KPO',
        'Web Development',
        'Product Development',
        'Application Development',
        'Testing',
        'IT Management',
        'Project Management',
        'Others'
    ];

    const marketing = [
        'Loyalty',
        'Branding',
        'Digital Marketing (SEO/Automation)',
        'Discovery',
        'Sales',
        'Market Research',
        'Others'
    ];

    const mediaAndEntertainment = [
        'Digital Media News',
        'Digital Media Video',
        'Digital Media Blogging',
        'Digital Media Publishing',
        'Digital Media',
        'Movies',
        'OOH Media',
        'Social Media',
        'Entertainment',
        'Others'
    ];

    const nanoTechnology = ["Others"]
    const petsandAnimals = ["Others"]

    const commercialServices = [
        'Environmental Services & Equipment',
        'Commercial Printing Services',
        'Employment Services',
        'Business Support Services',
        'Professional Information Services',
        'Business Support Supplies',
        'Others'
    ];

    const realEstate = [
        'Housing',
        'Coworking Spaces',
        'Others'
    ];

    const retail = [
        'Retail Technology',
        'Social Commerce',
        'Comparison Shopping',
        'Others'
    ];

    const specialRetailers = [
        'Auto Vehicles, Parts & Service Retailers',
        'Home Improvement Products & Services Retailers',
        'Home Furnishings Retailers',
        'Computer & Electronics Retailers',
        'Others'
    ];

    const robotics = [
        'Robotics Technology',
        'Robotics Application',
        'Others'
    ];

    const safety = [
        'Personal Security',
        'Others'
    ];

    const securitySolutions = [
        'Cyber Security',
        'Home Security Solutions',
        'Public/Citizen Security Solutions',
        'Others'
    ];

    const householdServices = [
        'Personal Care',
        'Laundry',
        'Baby Care',
        'Home Care',
        'Others'
    ];
    const socialImpact = [
        'NGO',
        'Corporate Social Responsibility',
        'Others'
    ];

    const socialNetwork = ["Others"]

    const sports = [
        'Fantasy Sports',
        'Sports Promotion and Networking',
        'Others'
    ];

    const games = [
        'Physical Toys and Games',
        'Virtual Games'
    ];

    const logistics = ["Others"]

    const textiles = [
        'Leather Textiles Goods',
        'Non-Leather Textiles Goods',
        'Apparel & Accessories',
        'Leather Footwear',
        'Non-Leather Footwear',
        'Others'
    ];

    const transportation = [
        'Freight & Logistics Services',
        'Passenger Transportation Services',
        'Transport Infrastructure',
        'Traffic Management',
        'Others'
    ];

    const passengerExperience = ["Others"]
    const travel = [
        'Holiday Rentals',
        'Hotel',
        'Experiential Travel',
        'Ticketing',
        'Hospitality',
        'Facility Management',
        'Wayside Amenities',
        'Others'
    ];

    const indicLanguageStartup = [
        'Media and Entertainment',
        'Natural Language Processing',
        'E-Commerce',
        'Social Media',
        'Utility Services',
        'Education'
    ];

    const dropdownItems = [
        { name: "Aeronautics/Aerospace & Defence", options: aeronauticsOptions },
        { name: "Airport", options: airportOptions },
        { name: "Advertising", options: Advertising },
        { name: "Agriculture", options: agricultureOptions },
        { name: "AI", options: AI },
        { name: "Analytics", options: analytics },
        { name: "Animation", options: animation },
        { name: "Virtual Reality", options: virtualReality },
        { name: "Architecture", options: architecture },
        { name: "Art", options: art },
        { name: "Automotive", options: automotive },
        { name: "Chemical", options: chemical },
        { name: "Telecommunication", options: telecommunication },
        { name: "Computer Vision", options: computerVision },
        { name: "Construction", options: construction },
        { name: "Dating", options: dating },
        { name: "Design", options: design },
        { name: "Education", options: education },
        { name: "Non-Renewable Energy", options: nonRenewableEnergy },
        { name: "Renewable Energy", options: renewableEnergy },
        { name: "Green Technology", options: greenTechnology },
        { name: "Waste Management", options: wasteManagement },
        { name: "Biotechnology", options: biotechnology },
        { name: "Enterprise Software", options: enterpriseSoftware },
        { name: "Events", options: events },
        { name: "Fashion", options: fashion },
        { name: "Food", options: food },
        { name: "Internet", options: internet },
        { name: "Finance", options: finance },
        { name: "Hardware", options: hardware },
        { name: "Healthcare", options: healthcare },
        { name: "Human Resource", options: humanResource },
        { name: "IT Services", options: itServices },
        { name: "Marketing", options: marketing },
        { name: "Media and Entertainment", options: mediaAndEntertainment },
        { name: "Nano Technology", options: nanoTechnology },
        { name: "Pets and Animals", options: petsandAnimals },
        { name: "Commercial Services", options: commercialServices },
        { name: "Real Estate", options: realEstate },
        { name: "Retail", options: retail },
        { name: "Special Retailers", options: specialRetailers },
        { name: "Robotics", options: robotics },
        { name: "Safety", options: safety },
        { name: "Security Solutions", options: securitySolutions },
        { name: "Household Services", options: householdServices },
        { name: "Social Impact", options: socialImpact },
        { name: "Social Network", options: socialNetwork },
        { name: "Sports", options: sports },
        { name: "Games", options: games },
        { name: "Logistics", options: logistics },
        { name: "Textiles", options: textiles },
        { name: "Transportation", options: transportation },
        { name: "Passenger Experience", options: passengerExperience },
        { name: "Travel", options: travel },
        { name: "Indic Language Startup", options: indicLanguageStartup }
    ];

    



    const handleStatusChange = async (industryOption, statusClass, options) => {
        setStatus(industryOption);
        setStatusClass(statusClass);
        onIndustryChange(industryOption, options)
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-industry`, {
                companyName,
                serviceName,
                industryOption
            });
            if (response.status === 200) {
                refreshData();
                //setOpenEmailPopup(false); // Close the popup on success
            }


        } catch (error) {
            console.log("Error Sending Industry", error.message)

        }
        //setNewSubStatus(newStatus);
    };

    console.log("mainStatus" , mainStatus)

    return (

        <select
        className={(mainStatus === "Approved" || mainStatus === "Submitted") ? "disabled" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value, dropdownItems.find(item => item.name === e.target.value)?.options)}
        value={status} // Ensure this matches one of the option values
    >
        <option disabled selected value="">Select Industry</option>
        {dropdownItems.map((item, index) => (
            <option key={index} value={item.name}>
                {item.name}
            </option>
        ))}
    </select>
    

    );
};

export default IndustryDropdown;