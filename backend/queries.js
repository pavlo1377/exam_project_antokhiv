// queries.js

// QUERY FOR 3RD YEAR
const GET_SCHEDULE_QUERY_THIRD_YEAR = `
  SELECT 
     sch.id AS id,
      d.name AS day,
      h.time_range AS hour,
      s.name AS subject,
      s.teacher,
      s.room
  FROM 
      scheduleThirdYear sch
  JOIN 
      days d ON sch.day_id = d.id
  JOIN 
      hours h ON sch.hour_id = h.id
  JOIN 
      subjects s ON sch.subject_id = s.id
  ORDER BY 
      d.id, h.id;
`;

// QUERY FOR 2ND YEAR

const GET_SCHEDULE_QUERY_SECOND_YEAR = `  SELECT 
  sch.id AS id,
  d.name AS day,
  h.time_range AS hour,
  s.name AS subject,
  s.teacher,
  s.room
FROM 
  scheduleSecondYear sch
JOIN 
  days d ON sch.day_id = d.id
JOIN 
  hours h ON sch.hour_id = h.id
JOIN 
  subjectsSecondYear s ON sch.subject_id = s.id
ORDER BY 
  d.id, h.id;`;

// QUERY FOR 1ST YEAR

const GET_SCHEDULE_QUERY_FIRST_YEAR = ` SELECT 
  sch.id AS id,  -- Додаємо ID запису
  d.name AS day,
  h.time_range AS hour,
  s.name AS subject,
  s.teacher,
  s.room
FROM 
  scheduleFirstYear sch
JOIN 
  days d ON sch.day_id = d.id
JOIN 
  hours h ON sch.hour_id = h.id
JOIN 
  subjectsFirstYear s ON sch.subject_id = s.id
ORDER BY 
  d.id, h.id;
`;

export {
  GET_SCHEDULE_QUERY_THIRD_YEAR,
  GET_SCHEDULE_QUERY_SECOND_YEAR,
  GET_SCHEDULE_QUERY_FIRST_YEAR,
}; // Експортуємо запит
