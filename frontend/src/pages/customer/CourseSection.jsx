const CourseSection = () => {
  const courses = [
    {
      title: "HTML Basics",
      description: "Learn the fundamentals of HTML",
      url: "https://studentsforstudents.fast-page.org/courses/im-going-crazy/",
      instructor: "John Doe",
      level: "Beginner"
    }
    // Add more courses here as they're created
  ];

  return (
    <div className="courses-section">
      <h2>Available Courses</h2>
      <div className="course-grid">
        {courses.map((course, index) => (
          <div key={index} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Instructor:</strong> {course.instructor}</p>
            <p><strong>Level:</strong> {course.level}</p>
            <a 
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Start Learning
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSection;