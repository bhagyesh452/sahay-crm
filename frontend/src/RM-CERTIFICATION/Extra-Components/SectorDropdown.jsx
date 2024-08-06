import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';

const SectorDropdown = ({ companyName, serviceName, refreshData, sectorOptions, industry, sector , mainStatus }) => {
    const [status, setStatus] = useState(""); // Start with an empty string for default
    const [options, setOptions] = useState([]);
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    useEffect(() => {
        const sectorOptionsForIndustry = getSectorOptionsForIndustry(industry);
        setOptions(sectorOptionsForIndustry);
        setStatus(sector || ""); // Set the sector value if provided
    }, [industry, sector]);

    const handleStatusChange = async (sectorOption) => {
        setStatus(sectorOption);
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-sector`, {
                companyName,
                serviceName,
                sectorOption
            });
            if (response.status === 200) {
                refreshData();
            }
        } catch (error) {
            console.log("Error Sending Sector", error.message);
        }
    };

    const getSectorOptionsForIndustry = (industry) => {
        // Define your sector options for each industry here
        const industrySectors = {
            "Aeronautics/Aerospace & Defence": [
                "Drones",
                "Space Technology",
                "Defence Equipment",
                "Aviation & Others",
                "Others"
            ],
            "Airport": ["Others"],
            "Advertising": [
                'AdTech',
                'Online Classified',
                'Others'
            ],
            "Agriculture": [
                "Dairy Farming",
                "Organic Agriculture",
                "Agri-Tech",
                "Food Processing",
                "Horticulture",
                "Fisheries",
                "Animal Husbandry",
                "Others"
            ],
            "AI": [
                'Machine Learning',
                'NLP',
                'Others'
            ],
            "Analytics": [
                'Business Intelligence',
                'Big Data',
                'Data Science',
                'Others'
            ],
            "Animation": ["Others"],
            "Virtual Reality": ["Others"],
            "Architecture": ["Others"],
            "Art": [
                'Handicraft',
                'Art',
                'Photography',
                'Others'
            ],
            "Automotive": [
                'Auto & Truck Manufacturers',
                'Auto, Truck & Motorcycle Parts',
                'Tires & Rubber Products',
                'Electric Vehicles',
                'Others'
            ],
            "Chemical": [
                'Commodity Chemicals',
                'Agricultural Chemicals',
                'Specialty Chemicals',
                'Diversified Chemicals',
                'Others'
            ],
            "Telecommunication": [
                'Wireless',
                'Integrated Communication Services',
                'Network Technology Solutions',
                'Others'
            ],
            "Computer Vision": ["Others"],
            "Construction": [
                'New-age Construction Technologies',
                'Construction Materials',
                'Construction & Engineering',
                'Construction Supplies & Fixtures',
                'Homebuilding',
                'Others'
            ],
            "Dating": ["Others"],
            "Design": [
                'Web Design',
                'Industrial Design',
                'Others'
            ],
            "Education": [
                'E-learning',
                'Education Technology',
                'Skill Development',
                'Coaching',
                'Others'
            ],
            "Non-Renewable Energy": [
                'Oil & Gas Exploration and Production',
                'Oil & Gas Drilling',
                'Oil Related Services and Equipment',
                'Oil & Gas Transportation Services',
                'Others'
            ],
            "Renewable Energy": [
                'Renewable Solar Energy',
                'Renewable Wind Energy',
                'Renewable Nuclear Energy',
                'Renewable Energy Solutions',
                'Manufacture of Machinery and Equipment',
                'Manufacture of Electrical Equipment',
                'Others'
            ],
            "Green Technology": [
                'Waste Management',
                'Clean Tech',
                'Others'
            ],
            "Waste Management": ["Others"],
            "Biotechnology": ["Others"],
            "Enterprise Software": [
                'Cloud',
                'ERP',
                'CXM',
                'SCM',
                'Customer Support',
                'Collaboration',
                'Location Based',
                'Enterprise Mobility',
                'Others'
            ],
            "Events": [
                'Weddings',
                'Event Management',
                'Others'
            ],
            "Fashion": [
                'Fashion Technology',
                'Lifestyle',
                'Apparel',
                'Fan Merchandise',
                'Jewellery',
                'Others'
            ],
            "Food": [
                'Restaurants',
                'Food Processing',
                'Microbrewery',
                'Food Technology/Food Delivery',
                'Others'
            ],
            "Internet": [
                'Smart Home',
                'Manufacturing & Warehouse',
                'Wearables',
                'Others'
            ],
            "Finance": [
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
            ],
            "Hardware": [
                'Embedded',
                'Semiconductor',
                'Electronics',
                '3D Printing',
                'Manufacturing',
                'Others'
            ],
            "Healthcare": [
                'Assistance Technology',
                'Medical Devices/Biomedical',
                'Health & Wellness',
                'Pharmaceutical',
                'Biotechnology',
                'Healthcare Services',
                'Healthcare IT',
                'Healthcare Technology',
                'Others'
            ],
            "Human Resource": [
                'Recruitment/Jobs',
                'Training',
                'Skills Assessment',
                'Talent Management',
                'Internships',
                'Others'
            ],
            "IT Services": [
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
            ],
            "Marketing": [
                'Loyalty',
                'Branding',
                'Digital Marketing (SEO/Automation)',
                'Discovery',
                'Sales',
                'Market Research',
                'Others'
            ],
            "Media and Entertainment": [
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
            ],
            "Nano Technology": ["Others"],
            "Pets and Animals": ["Others"],
            "Commercial Services": [
                'Environmental Services & Equipment',
                'Commercial Printing Services',
                'Employment Services',
                'Business Support Services',
                'Professional Information Services',
                'Business Support Supplies',
                'Others'
            ],
            "Real Estate": [
                'Housing',
                'Coworking Spaces',
                'Others'
            ],
            "Retail": [
                'Retail Technology',
                'Social Commerce',
                'Comparison Shopping',
                'Others'
            ],
            "Special Retailers": [
                'Auto Vehicles, Parts & Service Retailers',
                'Home Improvement Products & Services Retailers',
                'Home Furnishings Retailers',
                'Computer & Electronics Retailers',
                'Others'
            ],
            "Robotics": [
                'Robotics Technology',
                'Robotics Application',
                'Others'
            ],
            "Safety": [
                'Personal Security',
                'Others'
            ],
            "Security Solutions": [
                'Cyber Security',
                'Home Security Solutions',
                'Public/Citizen Security Solutions',
                'Others'
            ],
            "Household Services": [
                'Personal Care',
                'Laundry',
                'Baby Care',
                'Home Care',
                'Others'
            ],
            "Social Impact": [
                'NGO',
                'Corporate Social Responsibility',
                'Others'
            ],
            "Social Network": ["Others"],
            "Sports": [
                'Fantasy Sports',
                'Sports Promotion and Networking',
                'Others'
            ],
            "Games": [
                'Physical Toys and Games',
                'Virtual Games'
            ],
            "Logistics": ["Others"],
            "Textiles": [
                'Leather Textiles Goods',
                'Non-Leather Textiles Goods',
                'Apparel & Accessories',
                'Leather Footwear',
                'Non-Leather Footwear',
                'Others'
            ],
            "Transportation": [
                'Freight & Logistics Services',
                'Passenger Transportation Services',
                'Transport Infrastructure',
                'Traffic Management',
                'Others'
            ],
            "Passenger Experience": ["Others"],
            "Travel": [
                'Holiday Rentals',
                'Hotel',
                'Experiential Travel',
                'Ticketing',
                'Hospitality',
                'Facility Management',
                'Wayside Amenities',
                'Others'
            ],
            "Indic Language Startup": [
                'Media and Entertainment',
                'Natural Language Processing',
                'E-Commerce',
                'Social Media',
                'Utility Services',
                'Education'
            ]
        };
        return industrySectors[industry] || [];
    };
    return (
        <select
        className={(mainStatus === "Approved" || mainStatus === "Submitted") ? "disabled" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
            //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
            aria-labelledby="dropdownMenuButton1"
            onChange={(e) => handleStatusChange(e.target.value)}
            value={status}
        >
            <option value="" disabled>Select Sector</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default SectorDropdown;
