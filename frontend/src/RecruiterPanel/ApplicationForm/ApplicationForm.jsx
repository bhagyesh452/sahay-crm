import React from 'react'


function ApplicationForm() {
  return (
    <div>
       {/* <!-- Header Section Start --> */}
    <header>
      <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onclick="toggleNavbar()"aria-label="Toggle navigation">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
          </button>
            <a class="navbar-brand" href="/">
              <img class="brand" alt="startup sahay" src="./uploads/2023/05/cropped-Sahay-r-mark-logo.png"/>
            </a>
          </div>
          <div class="navbar-collapse collapse show" id="myNavbar" aria-expanded="false">
            <div class="menu-header-menu-container">
              <ul id="menu-header-menu" class="menu">
                <li id="home_menu" class="menu-item home_menu">
                  <a href="/" aria-current="page">Home</a>
                </li>
                <li id="about_menu" class="menu-item menu-item-has-children about_menu">
                  <a href="about-us.html">About Us 
                  </a>
                  <i class="fa navcticn fa-angle-down" aria-hidden="true"></i>
                  <ul class="sub-menu">
                    <li id="about_menu1" class="menu-item about_menu1">
                      <a href="about-us.html">About</a>
                    </li>
                    <li id="Mission_Vision_menu" class="menu-item menu-item-object-custom Mission_Vision_menu">
                      <a href="about-us.html#mission-and-vision">Mission &amp; Vision</a>
                    </li>
                    <li id="why_choose_us_menu" class="menu-item menu-item-object-custom why_choose_us_menu">
                      <a href="about-us.html#why_choose_us">Why Choose Us</a>
                    </li>
                  </ul>
                </li>
                <li id="services_menu" class="menu-item menu-item-has-children services_menu">
                  <a href="all-services.html">Services 
                  </a>
                  <i class="fa navcticn fa-angle-down" aria-hidden="true"></i>
                  <ul class="sub-menu">
                    <li id="Start_Up_help_menu" class="menu-item Start_Up_help_menu">
                      <a href="./service_category/start-up-help.html">Start-Up Help</a>
                    </li>
                    <li id="Company_Incorporation_menu" class="menu-item Company_Incorporation_menu">
                      <a href="./service_category/company-incorporation.html">Company Incorporation</a>
                    </li>
                    <li id="Registration_menu" class="menu-item Registration_menu">
                      <a href="./service_category/registration.html">Registration</a>
                    </li>
                    <li id="GST_Works_menu" class="menu-item GST_Works_menu">
                      <a href="./service_category/registration.html">GST Works</a>
                    </li>
                    <li id="TAX_Filing_menu" class="menu-item TAX_Filing_menu">
                      <a href="./service_category/tax-filing.html">TAX Filing</a>
                    </li>
                    <li id="Certifications_menu" class="menu-item Certifications_menu">
                      <a href="./service_category/certifications.html">Certifications</a>
                    </li>
                    <li id="Mandatory_Compliance_menu" class="menu-item Mandatory_Compliance_menu">
                      <a href="./service_category/mandatory-compliance.html">Mandatory Compliance</a>
                    </li>
                    <li id="Annual_Compliance_menu" class="menu-item Annual_Compliance_menu">
                      <a href="./service_category/annual-compliance.html">Annual Compliance</a>
                    </li>
                    <li id="Website_Designing_menu" class="menu-item Website_Designing_menu">
                      <a href="./service_category/website-designing.html">Website Designing</a>
                    </li>
                  </ul>
                </li>
                <li id="Contact_Us_menu" class="menu-item Contact_Us_menu">
                  <a href="./contact-us.html">Contact Us</a>
                </li>
                <li id="Portfolio_menu" class="menu-item Portfolio_menu">
                  <a href="./portfolio.html">Portfolio</a>
                </li>
                <li id="Portfolio_menu" class="menu-item blog_menu">
                  <a href="./blog.html">Blog</a>
                </li>
                <li id="Join_Us_menu" class="special menu-item Join_Us_menu hide-on-tablet">
                  <a href="./join-us.html">Join Us</a>
                </li><li id="pay_now_menu" class="special menu-item Join_Us_menu hide-on-tablet">
                  <a href="https://pages.razorpay.com/startupsahay">Pay Now</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
    </div>
  )
}

export default ApplicationForm