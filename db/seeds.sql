INSERT INTO department (department_name)
VALUES("Sales"),
      ("Engineering"),
      ("Finance"),
      ("Marketing"),
      ("Legal"), 
      ("Information Technology");

INSERT INTO roles (title, salary, department_id)
VALUES("Sales Manager", 100000, 1),
      ("Salesperson", 80000, 1),
      ("Lead Engineer", 150000, 2),
      ("Software Engineer", 120000, 2),
      ("Accountant Manager", 150000, 3),
      ("Accountant", 110000, 3),
      ("Head Lawyer", 200000, 5),
      ("Lawyer", 180000, 5),
      ("Marketing Manager", 130000, 4),
      ("Marketing Associate", 100000, 4),
      ("IT Manager", 150000, 6),
      ("IT Associate", 100000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Chandler", "Bing", 1, null),
      ("Joey", "Tribbiani", 2, 1),
      ("McCoy", "Didericksen", 3, null),
      ("Ross", "Geller", 4, 3),
      ("Gunther", "Johnson", 5, null),
      ("Mike", "Hannigan", 6, 5),
      ("Monica", "Geller", 7, null),
      ("Emily", "Waltham", 8, 7),
      ("Phoebe", "Buffay", 9, null),
      ("Rachel", "Green", 10, 9),
      ("Janice", "Jones", 11, null),
      ("Ben", "Geller", 12, 11);