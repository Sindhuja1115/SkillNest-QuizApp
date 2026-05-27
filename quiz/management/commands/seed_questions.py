from django.core.management.base import BaseCommand
from quiz.models import Category, Quiz, Question, Option

QUESTION_TEMPLATES = {
    "Aptitude": [
        {
            "text": "What is the next number in the series: 2, 4, 8, 16, ?",
            "options": ["20", "24", "32", "36"],
            "correct": 2,
            "explanation": "Each number is multiplied by 2."
        },
        {
            "text": "A train travels 60 km in 1 hour. What is its speed?",
            "options": ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
            "correct": 1,
            "explanation": "Speed = Distance / Time = 60/1."
        },
        {
            "text": "What is 25% of 200?",
            "options": ["25", "40", "50", "75"],
            "correct": 2,
            "explanation": "25% of 200 = 50."
        },
        {
            "text": "If 5 workers complete a task in 10 days, how many days for 10 workers?",
            "options": ["5", "10", "15", "20"],
            "correct": 0,
            "explanation": "More workers reduce the time required."
        },
        {
            "text": "Find the average of 10, 20, 30, 40, 50.",
            "options": ["20", "25", "30", "35"],
            "correct": 2,
            "explanation": "Average = Sum / Count = 150 / 5."
        },
        {
            "text": "What is the square root of 144?",
            "options": ["10", "11", "12", "13"],
            "correct": 2,
            "explanation": "12 × 12 = 144."
        },
        {
            "text": "A shop gives 10% discount on ₹500. Find final price.",
            "options": ["₹400", "₹450", "₹480", "₹490"],
            "correct": 1,
            "explanation": "10% of 500 is 50, so 500 - 50 = 450."
        },
        {
            "text": "What is 15 + 18?",
            "options": ["30", "31", "32", "33"],
            "correct": 3,
            "explanation": "15 + 18 = 33."
        },
        {
            "text": "If a car covers 120 km in 2 hours, what is its average speed?",
            "options": ["50 km/h", "55 km/h", "60 km/h", "65 km/h"],
            "correct": 2,
            "explanation": "Average speed = 120 / 2."
        },
        {
            "text": "What is the probability of getting head in a coin toss?",
            "options": ["0", "1/4", "1/2", "1"],
            "correct": 2,
            "explanation": "A coin has two equally likely outcomes."
        },
    ],

    "Technical": [
        {
            "text": "What does CPU stand for?",
            "options": ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Control Processing Unit"],
            "correct": 1,
            "explanation": "CPU means Central Processing Unit."
        },
        {
            "text": "Which device stores permanent data?",
            "options": ["RAM", "Cache", "ROM", "Register"],
            "correct": 2,
            "explanation": "ROM stores permanent instructions."
        },
        {
            "text": "Which protocol is used for web pages?",
            "options": ["FTP", "HTTP", "SMTP", "SSH"],
            "correct": 1,
            "explanation": "HTTP is used for websites."
        },
        {
            "text": "What is the brain of the computer?",
            "options": ["RAM", "Hard Disk", "CPU", "Monitor"],
            "correct": 2,
            "explanation": "CPU performs processing operations."
        },
        {
            "text": "Which memory is volatile?",
            "options": ["ROM", "Hard Disk", "RAM", "SSD"],
            "correct": 2,
            "explanation": "RAM loses data when power is off."
        },
        {
            "text": "Which topology uses a central hub?",
            "options": ["Bus", "Ring", "Star", "Mesh"],
            "correct": 2,
            "explanation": "Star topology uses a central hub."
        },
        {
            "text": "What does URL stand for?",
            "options": ["Uniform Resource Locator", "Universal Resource Locator", "Uniform Reference Link", "Universal Reference Link"],
            "correct": 0,
            "explanation": "URL means Uniform Resource Locator."
        },
        {
            "text": "Which operating system is open source?",
            "options": ["Windows", "Linux", "macOS", "DOS"],
            "correct": 1,
            "explanation": "Linux is open source."
        },
        {
            "text": "Which layer of OSI model handles routing?",
            "options": ["Transport", "Application", "Network", "Session"],
            "correct": 2,
            "explanation": "Network layer handles routing."
        },
        {
            "text": "What is phishing?",
            "options": ["Gaming attack", "Cyber fraud", "Programming method", "Encryption"],
            "correct": 1,
            "explanation": "Phishing is a cyber attack to steal data."
        },
    ],

    "Programming Basics": [
        {
            "text": "Which keyword is used to define a function in Python?",
            "options": ["func", "define", "def", "function"],
            "correct": 2,
            "explanation": "Python uses 'def' keyword."
        },
        {
            "text": "What is the output of print(5 + 2)?",
            "options": ["52", "7", "10", "Error"],
            "correct": 1,
            "explanation": "5 + 2 equals 7."
        },
        {
            "text": "Which symbol is used for comments in Python?",
            "options": ["//", "#", "/*", "--"],
            "correct": 1,
            "explanation": "Python comments start with #."
        },
        {
            "text": "Which data type stores True or False?",
            "options": ["int", "float", "bool", "str"],
            "correct": 2,
            "explanation": "Boolean type stores True/False."
        },
        {
            "text": "Which loop repeats until condition becomes false?",
            "options": ["for", "if", "while", "switch"],
            "correct": 2,
            "explanation": "While loop runs until condition becomes false."
        },
        {
            "text": "Which operator is used for multiplication?",
            "options": ["+", "-", "*", "/"],
            "correct": 2,
            "explanation": "* is multiplication operator."
        },
        {
            "text": "Which function displays output in Python?",
            "options": ["input()", "display()", "show()", "print()"],
            "correct": 3,
            "explanation": "print() displays output."
        },
        {
            "text": "Which collection allows duplicate values?",
            "options": ["set", "dictionary", "tuple", "list"],
            "correct": 3,
            "explanation": "Lists allow duplicates."
        },
        {
            "text": "Which keyword is used for conditions?",
            "options": ["if", "loop", "case", "func"],
            "correct": 0,
            "explanation": "'if' is used for conditions."
        },
        {
            "text": "Which method converts string to integer in Python?",
            "options": ["str()", "float()", "int()", "bool()"],
            "correct": 2,
            "explanation": "int() converts values to integer."
        },
    ],

    "SQL & DBMS": [
        {
            "text": "Which SQL command is used to fetch data from a table?",
            "options": ["GET", "SELECT", "FETCH", "OPEN"],
            "correct": 1,
            "explanation": "SELECT is used to retrieve data."
        },
        {
            "text": "Which clause is used to filter records in SQL?",
            "options": ["ORDER BY", "WHERE", "GROUP BY", "HAVING"],
            "correct": 1,
            "explanation": "WHERE filters rows based on conditions."
        },
        {
            "text": "Which key uniquely identifies a record in a table?",
            "options": ["Foreign Key", "Candidate Key", "Primary Key", "Alternate Key"],
            "correct": 2,
            "explanation": "Primary Key uniquely identifies each row."
        },
        {
            "text": "Which normal form removes partial dependency?",
            "options": ["1NF", "2NF", "3NF", "BCNF"],
            "correct": 1,
            "explanation": "2NF removes partial dependency."
        },
        {
            "text": "Which SQL function counts rows?",
            "options": ["SUM()", "COUNT()", "AVG()", "TOTAL()"],
            "correct": 1,
            "explanation": "COUNT() counts records."
        },
        {
            "text": "What does DBMS stand for?",
            "options": ["Data Backup Management System", "Database Management System", "Digital Base Management System", "Database Method System"],
            "correct": 1,
            "explanation": "DBMS means Database Management System."
        },
        {
            "text": "Which JOIN returns matching rows from both tables?",
            "options": ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"],
            "correct": 2,
            "explanation": "INNER JOIN returns matching rows."
        },
        {
            "text": "Which command removes all rows but keeps table structure?",
            "options": ["DELETE", "DROP", "REMOVE", "TRUNCATE"],
            "correct": 3,
            "explanation": "TRUNCATE removes rows only."
        },
        {
            "text": "Which clause sorts SQL results?",
            "options": ["SORT BY", "ORDER BY", "GROUP BY", "ALIGN BY"],
            "correct": 1,
            "explanation": "ORDER BY sorts records."
        },
        {
            "text": "Which SQL statement adds new records?",
            "options": ["INSERT", "ADD", "UPDATE", "CREATE"],
            "correct": 0,
            "explanation": "INSERT adds new rows."
        },
    ],

    "DSA": [
        {
            "text": "Which data structure follows FIFO order?",
            "options": ["Stack", "Queue", "Tree", "Graph"],
            "correct": 1,
            "explanation": "Queue follows First In First Out."
        },
        {
            "text": "Which data structure follows LIFO order?",
            "options": ["Queue", "Array", "Stack", "Linked List"],
            "correct": 2,
            "explanation": "Stack follows Last In First Out."
        },
        {
            "text": "What is the time complexity of binary search?",
            "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            "correct": 1,
            "explanation": "Binary search halves search space each step."
        },
        {
            "text": "Which traversal visits root first?",
            "options": ["Inorder", "Postorder", "Preorder", "Level order"],
            "correct": 2,
            "explanation": "Preorder visits root before subtrees."
        },
        {
            "text": "Which data structure uses nodes and pointers?",
            "options": ["Array", "Linked List", "Matrix", "Stack"],
            "correct": 1,
            "explanation": "Linked lists use nodes connected by pointers."
        },
        {
            "text": "Which sorting algorithm has best average performance?",
            "options": ["Bubble Sort", "Selection Sort", "Quick Sort", "Linear Sort"],
            "correct": 2,
            "explanation": "Quick Sort performs efficiently on average."
        },
        {
            "text": "Which traversal gives sorted output in BST?",
            "options": ["Preorder", "Postorder", "Inorder", "Level order"],
            "correct": 2,
            "explanation": "Inorder traversal of BST gives sorted order."
        },
        {
            "text": "Which data structure is used in recursion?",
            "options": ["Queue", "Stack", "Heap", "Tree"],
            "correct": 1,
            "explanation": "Recursion uses function call stack."
        },
        {
            "text": "What is the worst-case time complexity of Bubble Sort?",
            "options": ["O(log n)", "O(n)", "O(n²)", "O(1)"],
            "correct": 2,
            "explanation": "Bubble Sort worst case is O(n²)."
        },
        {
            "text": "Which structure stores hierarchical data?",
            "options": ["Queue", "Array", "Tree", "Stack"],
            "correct": 2,
            "explanation": "Trees represent hierarchical relationships."
        },
    ]
}

ALLOWED_CATEGORIES = ["Aptitude", "Technical", "Programming Basics", "SQL & DBMS", "DSA"]

def expand_templates(base_list, cat_name, target_count=10):
    """Return a list of exactly *target_count* question dicts.
    If *base_list* has fewer items, generate simple placeholder questions to reach the count.
    No "Variant" suffixes are added – each generated question is unique and includes the category name.
    """
    result = list(base_list)
    index = 1
    while len(result) < target_count:
        placeholder = {
            "text": f"Placeholder question {index} for {cat_name}",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": 0,
            "explanation": "Automatically generated placeholder to ensure enough unique questions."
        }
        result.append(placeholder)
        index += 1
    return result[:target_count]


class Command(BaseCommand):
    help = "Seeds the database with interview‑level questions for each allowed category."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Clearing old data...'))
        Option.objects.all().delete()
        Question.objects.all().delete()
        Quiz.objects.all().delete()
        Category.objects.all().delete()

        # Track seen question texts to avoid accidental duplicates across categories
        seen_texts = set()

        for cat_name, templates in QUESTION_TEMPLATES.items():
            if cat_name not in ALLOWED_CATEGORIES:
                continue
            category, _ = Category.objects.get_or_create(name=cat_name)
            quiz, _ = Quiz.objects.get_or_create(
                category=category,
                title=f"{cat_name} Interview Quiz",
                defaults={"description": f"Test your knowledge in {cat_name}.", "time_limit": 600},
            )
            # Ensure we have exactly 10 unique questions for this category
            questions_data = expand_templates(templates, cat_name, target_count=10)
            for q in questions_data:
                if q["text"] in seen_texts:
                    continue  # skip exact duplicate question text
                seen_texts.add(q["text"])
                question = Question.objects.create(
                    quiz=quiz,
                    text=q["text"],
                    explanation=q["explanation"],
                )
                for idx, opt_text in enumerate(q["options"]):
                    Option.objects.create(
                        question=question,
                        text=opt_text,
                        is_correct=(idx == q["correct"])
                    )
        self.stdout.write(self.style.SUCCESS('Seeding completed with 10 unique questions per category.'))
