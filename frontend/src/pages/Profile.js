import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";


const Profile = () => {
  
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    country: "",
    state: "",
    city: "",
    contactNumber: "",
    email: "",
    education: [],
    experience: [],
    languages: [],
    skills: [],
  });

  // Flag to track if data has been loaded
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    axios
      .get("/aak/l1/me")
      .then((response) => {
        console.log(response.data.user);
        if (!isDataLoaded) {
          const userEducation = response.data.user.education;
          const userExperience = response.data.user.experience;
          const userLanguages = response.data.user.languages;
          const userSkills = response.data.user.skills;

          // If education is empty or undefined, initialize with an empty field object
          setEducationFields(
            userEducation && userEducation.length > 0 ? userEducation : [{ college: "", year: "", specialization: "" }]
          );

          setExperienceFields(
            userExperience && userExperience.length > 0
              ? userExperience
              : [{ company: "", role: "", duration: "", description: "" }]
          );

          setLanguageFields(
            userLanguages && userLanguages.length > 0 ? userLanguages : [{ language: "", proficiency: "" }]
          );
          setSkillFields(userSkills && userSkills.length > 0 ? userSkills : [{ skill: "", proficiency: "" }]);

          setUser(response.data.user);
          setIsDataLoaded(true);
        }
      })
      .catch((error) => console.error(error));
  }, [isDataLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSave = () => {
    axios
      .put("aak/l1/me/basic-info", user)
      .then((response) => {
        console.log("User info updated:", response.data);
        // You can add success handling here
      })
      .catch((error) => {
        console.error("There was an error updating the user info:", error);
        // You can add error handling here
      });
  };

  const [currentSection, setCurrentSection] = useState("basic");

  // State for dynamic fields
  const [educationFields, setEducationFields] = useState([{ college: "", year: "", specialization: "" }]);
  const [experienceFields, setExperienceFields] = useState([{ company: "", role: "", duration: "", description: "" }]);
  const [languageFields, setLanguageFields] = useState([{ language: "", proficiency: "" }]);
  const [skillFields, setSkillFields] = useState([{ skill: "", proficiency: "" }]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...educationFields];

    if (!updatedEducation[index]) {
      updatedEducation[index] = {}; // Initialize with an empty object
    }

    updatedEducation[index][name] = value;

    setEducationFields(updatedEducation);
    setUser({
      ...user,
      education: updatedEducation,
    });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperienceFields = [...experienceFields];

    updatedExperienceFields[index][name] = value;

    setExperienceFields(updatedExperienceFields);

    setUser({
      ...user,
      experience: experienceFields,
    });
  };

  const handleLanguageChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLanguageFields = [...languageFields];

    updatedLanguageFields[index][name] = value;

    setLanguageFields(updatedLanguageFields);

    setUser({
      ...user,
      languages: updatedLanguageFields,
    });
  };

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkillFields = [...skillFields];

    updatedSkillFields[index][name] = value;

    setSkillFields(updatedSkillFields);

    setUser({
      ...user,
      skills: updatedSkillFields,
    });
  };

  const handleAddMoreEducation = () => {
    console.log("Add More clicked");
    console.log(educationFields);
    setEducationFields([...educationFields, { college: "", year: "", specialization: "" }]);
    console.log(educationFields);
  };

  const handleAddMoreExperience = () => {
    setExperienceFields([...experienceFields, { company: "", role: "", duration: "", description: "" }]);
  };

  const handleAddMoreLanguage = () => {
    setLanguageFields([...languageFields, { language: "", proficiency: "" }]);
  };

  const handleAddMoreSkill = () => {
    setSkillFields([...skillFields, { skill: "", proficiency: "" }]);
  };

  const handleInputChange = (e, index, section) => {
    const { name, value } = e.target;

    switch (section) {
      case "education":
        const updatedEducationFields = [...educationFields];
        updatedEducationFields[index][name] = value;
        setEducationFields(updatedEducationFields);
        break;
      case "experience":
        const updatedExperienceFields = [...experienceFields];
        updatedExperienceFields[index][name] = value;
        setExperienceFields(updatedExperienceFields);
        break;
      case "languages":
        const updatedLanguageFields = [...languageFields];
        updatedLanguageFields[index][name] = value;
        setLanguageFields(updatedLanguageFields);
        break;
      case "skills":
        const updatedSkillFields = [...skillFields];
        updatedSkillFields[index][name] = value;
        setSkillFields(updatedSkillFields);
        break;
      default:
        break;
    }
  };

  const sections = ["basic", "education", "experience", "languages", "skills"];

  return (
    <div className="container-fluid profile-page-container">
      <div className="row justify-content-center">
        <div className="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-5 text-center p-0 mt-3 mb-2">
          <div className="card1 px-0 pt-4 pb-0 mt-3 mb-3">
            <form id="profile-form">
              <ul id="section-tabs">
                {sections.map((section) => (
                  <li
                    key={section}
                    className={currentSection === section ? "active" : ""}
                    onClick={() => handleSectionChange(section)}
                  >
                    <strong>{section.charAt(0).toUpperCase() + section.slice(1)}</strong>
                  </li>
                ))}
              </ul>
              <div className="section-content">
                {currentSection === "basic"  && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Basic Information:</h2>

                      {/* <!-- First Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">First Name: *</label>
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={user.firstName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Middle Name:</label>
                          <input
                            type="text"
                            name="middleName"
                            placeholder="Middle Name"
                            value={user.middleName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Last Name: *</label>
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={user.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* <!-- Second Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">Gender: *</label>
                          <input
                            type="text"
                            name="gender"
                            placeholder="Gender"
                            value={user.gender}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Date of Birth: *</label>
                          <input
                            type="date"
                            name="dob"
                            placeholder="Date of Birth"
                            value={user.dateOfBirth}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Country: *</label>
                          <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={user.country}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* <!-- Third Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">State/Province: *</label>
                          <input
                            type="text"
                            name="state"
                            placeholder="State/Province"
                            value={user.state}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">City: *</label>
                          <input type="text" name="city" placeholder="City" value={user.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="fieldlabels">Contact Number: *</label>
                          <input
                            type="text"
                            name="contact"
                            placeholder="Contact Number"
                            value={user.contactNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* <!-- Fourth Row --> */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="fieldlabels">Email ID: *</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email ID"
                            value={user.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <input type="button" name="save" className="action-button" value="Save" onClick={handleSave} />
                    </div>
                  </fieldset>
                )}
                {currentSection === "education" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Education:</h2>
                      {educationFields.map((field, index) => (
                        <div key={index} className="form-row">
                          <div className="form-group">
                            <label className="fieldlabels">College/University: *</label>
                            <input
                              type="text"
                              name="college"
                              value={field.college}
                              placeholder="College/University"
                              onChange={(e) => handleEducationChange(index, e)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Year of Passing: *</label>
                            <input
                              type="text"
                              name="year"
                              value={field.year}
                              placeholder="Year of Passing"
                              onChange={(e) => handleEducationChange(index, e)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Specialization: *</label>
                            <input
                              type="text"
                              name="specialization"
                              value={field.specialization}
                              placeholder="Specialization"
                              onChange={(e) => handleEducationChange(index, e)}
                            />
                          </div>
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreEducation}
                      />
                      <input type="button" name="save" className="action-button" value="Save" onClick={handleSave} />
                    </div>
                  </fieldset>
                )}
                {currentSection === "experience" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title" data-initial='E'>Experience:</h2>
                      {experienceFields.map((field, index) => (
                        <div key={index} className="form-row">
                          <div className="form-group">
                            <label className="fieldlabels">Company: *</label>
                            <input
                              type="text"
                              name="company"
                              value={field.company || ""}
                              placeholder="Company"
                              onChange={(e) => handleExperienceChange(index, e)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Role: *</label>
                            <input
                              type="text"
                              name="role"
                              value={field.role}
                              placeholder="Role"
                              onChange={(e) => handleExperienceChange(index, e)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Duration: *</label>
                            <input
                              type="text"
                              name="duration"
                              value={field.duration}
                              placeholder="Duration"
                              onChange={(e) => handleExperienceChange(index, e)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Description:</label>
                            <textarea
                              name="description"
                              value={field.description}
                              placeholder="Description"
                              onChange={(e) => handleExperienceChange(index, e)}
                            />
                          </div>
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreExperience}
                      />
                      <input type="button" name="save" className="action-button" value="Save" onClick={handleSave} />
                    </div>
                  </fieldset>
                )}
                {currentSection === "languages" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Languages:</h2>
                      {languageFields.map((field, index) => (
                        <div key={index} className="form-row">
                          <div className="form-group">
                            <label className="fieldlabels">Language: *</label>
                            <input
                              type="text"
                              name="language"
                              value={field.language}
                              placeholder="Language"
                              onChange={(e) => handleLanguageChange(index, e)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Proficiency: *</label>
                            <input
                              type="text"
                              name="proficiency"
                              value={field.proficiency}
                              placeholder="Proficiency"
                              onChange={(e) => handleLanguageChange(index, e)}
                            />
                          </div>
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreLanguage}
                      />
                      <input type="button" name="save" className="action-button" value="Save" onClick={handleSave} />
                    </div>
                  </fieldset>
                )}
                {currentSection === "skills" && (
                  <fieldset>
                    <div className="form-card">
                      <h2 className="fs-title">Skills:</h2>
                      {skillFields.map((field, index) => (
                        <div key={index} className="form-row">
                          <div className="form-group">
                            <label className="fieldlabels">Skill: *</label>
                            <input
                              type="text"
                              name="skill"
                              value={field.skill}
                              placeholder="Skill"
                              onChange={(e) => handleSkillChange(index, e)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="fieldlabels">Proficiency: *</label>
                            <input
                              type="text"
                              name="proficiency"
                              value={field.proficiency}
                              placeholder="Proficiency"
                              onChange={(e) => handleSkillChange(index, e)}
                            />
                          </div>
                        </div>
                      ))}
                      <input
                        type="button"
                        name="addMore"
                        className="action-button"
                        value="Add More"
                        onClick={handleAddMoreSkill}
                      />
                      <input type="button" name="save" className="action-button" value="Save" onClick={handleSave} />
                    </div>
                  </fieldset>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
