pragma solidity ^0.4.17;

import "./mortal.sol";
import "./CVExtender.sol";

contract MyCV is mortal, CVExtender{
    
	struct BasicInfo {
        string _name;           /// Name; First & Last
        string _label;          /// Job Title 
        string _email;          /// Email Address
        string _phone;          /// Phone Number
        string _website;        /// Website URL
        string _summary;        /// Executive Summary
    }

    struct Experience {
    	string _period; 		// Time period during which experience was attained
    	string _title;			// Role title
    	string _description;	// Role description
    }

    BasicInfo public basicInfo; 		// Basic Info object 
    mapping(uint => Experience) public m_experiences;			// List of experiences
    uint public experience_counter;		// Experience List counter


    event basicInfoSet(string _name, string _label, 
    string _email, string _phone, string _website, string _summary);

    event experienceAdded(uint experience_id, string _period, string _title, string _description);

    function MyCV () {    	
    setBasicInfo("Junaid Ahmed", "Software Engineer", 
		"juna1d@live.com", "+91 9642084724", "junzy.github.io",
		"Interested in different platforms and tools to build software for solving exciting problems at great scale.");
    }

    function addExperience(string _period, string _title, string _description)  public onlyowner returns (uint) {
    	experience_counter++;
        m_experiences[experience_counter] = Experience(_period, _title, _description);
        experienceAdded(experience_counter, _period, _title, _description);
        return experience_counter;
    }

    function getExperience(uint experience_id)  public returns (string _period, string _title, string _description){
        if (experience_counter == 0)
            throw;
        // declares arrays of size experience_counter.
        string period = m_experiences[experience_id]._period;
        string title = m_experiences[experience_id]._title;
        string description = m_experiences[experience_id]._description;
        return (period, title, description);
    }
    
	function setBasicInfo (string _name, string _label, 
		string _email, string _phone, string _website, string _summary) public onlyowner {
		basicInfo = BasicInfo(_name, _label, _email, _phone, _website, _summary);
		basicInfoSet(_name, _label, _email, _phone, _website, _summary);
	}

	function getTitle() constant public returns (string) {
		return basicInfo._label;
	}

	function getDescription() constant public returns (string) {
		return basicInfo._summary;
	}

	function getAuthor() constant public returns (string, string) {
		return (basicInfo._name, basicInfo._email);
	}

	function getAddress() constant public returns (string) {
		return basicInfo._website;
	}

}