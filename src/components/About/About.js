import React from "react";
import "./About.css";

const About = () => {
  const title = <span id='title-text'>Our Story</span>;
  const intro =
    "From humble beginnings, Magnus & Co. was conceived by a group of friends who all shared a passion for outdoor adventures. They wanted to extend beyond their immediate friend group to create an inclusive community focused on the preservation and admiration of the great American outdoors and all that it encompassed. While pursuing the creation of this community, these friends continued to learn of socioeconomic issues from their new members. They decided to do something about it.";
  const introToday =
    "They decided to create a credit union exclusively for their members, placing a cap once a specific threshold was met. By creating their own credit union, they were able to return all profits made back to their members, enabling immense loyalty and membership retention. All while maintaining their original foundation of their love of the outdoors and the importance of preserving nature at its core.";
  return (
    <div id='about-container'>
      <div id='intro-content'>
        <div id='intro-title-container'>
          <img src='images/leaf.png' alt='Story' id='intro-pic' />
          <h3 id='about-title'>{title}</h3>
        </div>

        <p>{intro}</p>
        <p>{introToday}</p>
      </div>
    </div>
  );
};

export default About;
