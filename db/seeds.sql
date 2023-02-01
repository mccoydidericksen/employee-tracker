USE employee_tracker_db;

INSERT INTO department (name)
VALUES("Sales"),
      ("Engineering"),
      ("Finance"),
      ("Marketing"),
      ("Legal"), 
      ("Information Technology");

INSERT INTO role (title, salary, department_id)
VALUES("Sales Manager", 100000, 1),
      ("Salesperson", 80000, 1),
      ("Lead Engineer", 150000, 2),
      ("Software Engineer", 120000, 2),
      ("Accountant", 125000, 3),
      ("Accountant Manager", 150000, 3),
      ("Head Lawyer", 200000, 5),
      ("Lawyer", 180000, 5),
      ("Marketing Manager", 130000, 4),
      ("Marketing Associate", 100000, 4),
      ("IT Manager", 150000, 6),
      ("IT Associate", 100000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Chandler", "Bing", 1),
      ("Joey", "Tribbiani", 2, 1),
      ("McCoy", "Didericksen", 3, 2),
      ("Ross", "Geller", 4, 2),
      ("Gunther", "Johnson", 5, 3),
      ("Mike", "Hannigan", 6, 3),
      ("Monica", "Geller", 7, 4),
      ("Emily", "Waltham", 8, 4),
      ("Phoebe", "Buffay", 9, 5),
      ("Rachel", "Green", 10, 5),
      ("Janice", "Jones", 11, 6),
      ("Ben", "Geller", 12, 6);