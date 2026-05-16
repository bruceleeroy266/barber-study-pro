-- Barber Study Pro v2.0 - Content Seed File
-- Generated: 2026-05-16T14:27:28.722Z


-- Chapter 1 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What were Egyptian barbers called?', 'Barbier', 'Tonsor', 'Meryma''at', 'Chirurgeon', 'c', 'Egyptian barbers were called ''Meryma''at'' meaning ''Beloved of Ma''at'' (goddess of truth and justice). They held high social status in ancient Egyptian society.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why did high-ranking Egyptian men and women shave their heads?', 'Religious punishment', 'For wigs and parasite prevention', 'Fashion trend', 'Military requirement', 'b', 'High-ranking Egyptians shaved their heads for cleanliness and to wear elaborate wigs. This practice helped prevent lice and parasites while allowing them to display status through their wigs.', 'medium', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which ancient civilization was the first to cultivate beauty extravagantly?', 'Greeks', 'Romans', 'Egyptians', 'Mesopotamians', 'c', 'The ancient Egyptians were the first civilization to cultivate beauty extravagantly, developing cosmetics, elaborate wigs, and sophisticated grooming practices around 3000 BC.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What simple tools were used for haircutting during the glacial age?', 'Electric clippers', 'Sharpened flints, oyster shells, bone, and animal sinew', 'Steel scissors and razors', 'Laser cutting devices', 'b', 'During the Upper Paleolithic period (40,000-10,000 BC), early humans used sharpened flints, oyster shells, bone, and animal sinew for haircutting and grooming.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'In many ancient cultures, what did hair symbolize spiritually?', 'Wealth only', 'Good and bad spirits entering/exiting the body', 'Social class only', 'Marriage status', 'b', 'In many ancient cultures, hair was believed to be the pathway for good and bad spirits to enter or exit the body, which is why hair cutting and styling had spiritual significance.', 'medium', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How did African cultures indicate status in hairstyles?', 'Only hair color', 'Intricate carved combs, beads, clay, colored bands, and braiding', 'Hair length only', 'Shaved heads only', 'b', 'African cultures used intricate carved combs, beads, clay, colored bands, and elaborate braiding patterns to indicate tribe, social status, and personal achievements.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'During what time period were early stone razors and scrapers used for hair removal?', 'Neolithic period', 'Upper Paleolithic (40,000-10,000 BC)', 'Ancient Rome', 'Medieval period', 'b', 'Early stone razors and scrapers were used during the Upper Paleolithic period, approximately 40,000 to 10,000 BC, making barbering one of humanity''s oldest professions.', 'hard', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does ''Meryma''at'' mean in ancient Egyptian?', 'Master of hair', 'Beloved of Ma''at', 'Servant of Pharaoh', 'Royal barber', 'b', '''Meryma''at'' means ''Beloved of Ma''at,'' referring to the Egyptian goddess of truth, justice, and cosmic order. This name reflects the high esteem in which barbers were held.', 'hard', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a barber-surgeon?', 'A barber who only cuts hair', 'Barbers who performed medical services including bloodletting and surgery', 'A surgeon who cuts hair part-time', 'A medieval knight''s personal groomer', 'b', 'Barber-surgeons were barbers who performed medical services including bloodletting, minor surgery, tooth extraction, and hair services during the Middle Ages.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the tonsure?', 'A medieval haircut style', 'Shaving a patch on the crown of the head worn by clergy', 'A surgical procedure', 'A type of beard trim', 'b', 'The tonsure is the practice of shaving a patch on the crown of the head, worn by medieval clergy as a sign of religious devotion, humility, and renunciation of worldly vanity.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When was the first barber guild formed?', '1066', '1096 in France', '1215', '1492', 'b', 'The first barber guild was formed in 1096 in France. Guilds were associations of craftsmen that protected mutual interests and maintained professional standards.', 'hard', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does the red on the barber pole represent?', 'Courage', 'Blood from bloodletting', 'Fire', 'Royalty', 'b', 'The red on the barber pole represents blood from bloodletting procedures, which was a primary service provided by barber-surgeons in medieval times.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does the white on the barber pole represent?', 'Snow', 'Bandages', 'Purity', 'Bones', 'b', 'The white on the barber pole represents bandages used to wrap patients'' arms after bloodletting procedures performed by barber-surgeons.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does the blue on the barber pole represent?', 'Sky', 'Veins', 'Water', 'Royal blood', 'b', 'The blue on the barber pole represents veins. The pole itself represents the staff patients held during bloodletting, with red (blood), white (bandages), and blue (veins).', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What services did barber-surgeons provide in medieval times?', 'Only haircuts', 'Haircuts, shaving, bloodletting, surgery, and dentistry', 'Only medical services', 'Only shaving and dentistry', 'b', 'Barber-surgeons provided a wide range of services including haircuts, shaving, bloodletting, minor surgery, tooth extraction, and other medical procedures for common people.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the primary medical service provided by barber-surgeons?', 'Haircuts', 'Bloodletting', 'Surgery', 'Dentistry', 'b', 'Bloodletting was the primary medical service provided by barber-surgeons. It was believed to cure many ailments by balancing the body''s ''humors.''', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did barbers and surgeons officially separate in England?', '1492', '1540', '1745', '1929', 'c', 'Barbers and surgeons officially separated in England in 1745 when the surgeons split from the barbers to form their own professional organization, marking the end of the barber-surgeon era.', 'hard', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Who reunited barbers and surgeons in 1540?', 'Queen Elizabeth I', 'King Henry VIII', 'King James I', 'Queen Victoria', 'b', 'King Henry VIII of England reunited barbers and surgeons in 1540 through a royal charter, though they eventually separated again permanently in 1745.', 'hard', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did barbering arrive in America?', 'With the Pilgrims in 1620', 'With early European colonists in the 1600s', 'During the Revolutionary War', 'In the 1800s', 'b', 'Barbering arrived in America with early European colonists in the 1600s. Barbers came to Jamestown and other colonies as essential community service providers.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What happened to barbering during the Great Depression?', 'It grew rapidly', 'Many barbers lost business as people cut hair at home', 'It became a government service', 'Prices increased dramatically', 'b', 'During the Great Depression of the 1930s, many barbers lost business as economic hardship led people to cut hair at home rather than pay for professional services.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did barbering experience a renaissance?', '1920s', 'Late 20th century with renewed interest in traditional techniques', 'During WWII', 'In the 1960s', 'b', 'Barbering experienced a renaissance in the late 20th century with renewed interest in traditional techniques, straight razor shaves, and classic men''s grooming.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the primary role of barbers in colonial America?', 'Only cutting hair', 'Essential community service providers', 'Government officials', 'Medical doctors', 'b', 'In colonial America, barbers served as essential community service providers, offering haircuts, shaves, and often minor medical services to settlers.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What led to the decline of barbering in the mid-20th century?', 'Lack of training', 'Unlicensed practitioners and home haircutting', 'Too many barbers', 'Government regulations', 'b', 'The decline of barbering in the mid-20th century was caused by a combination of unlicensed practitioners, economic hardships leading to home haircutting, and changing fashion trends.', 'hard', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is NABBA?', 'National Association of Beauty Barbers', 'National Association of State Boards of Barber Examiners', 'North American Barber Bureau', 'National Academy of Barber Arts', 'b', 'NABBA stands for the National Association of State Boards of Barber Examiners. It was founded in 1929 to standardize licensing and examinations across states.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When was NABBA founded?', '1900', '1929', '1945', '1970', 'b', 'NABBA was founded in 1929 during a meeting in Minneapolis. It was created to establish national standards for barber licensing and examinations.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the primary purpose of state barber boards?', 'To set prices', 'To protect public health through licensing and regulation', 'To train barbers', 'To sell barber supplies', 'b', 'The primary purpose of state barber boards is to protect public health by ensuring barbers meet education and sanitation standards through licensing and regulation.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a Master Barber?', 'Any licensed barber', 'A barber who has achieved the highest level of professional recognition', 'A barber with 1 year experience', 'A barber who only does haircuts', 'b', 'A Master Barber is a barber who has achieved the highest level of professional recognition, typically requiring years of experience, advanced training, and passing a comprehensive examination.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Where was NABBA founded?', 'New York', 'Minneapolis', 'Chicago', 'Los Angeles', 'b', 'NABBA was founded in Minneapolis in 1929, where representatives from various state barber boards met to establish national standards for the profession.', 'hard', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does NABBA standardize across states?', 'Prices', 'Licensing and examinations', 'Shop locations', 'Equipment brands', 'b', 'NABBA works to standardize licensing requirements and examination procedures across different states, making it easier for barbers to transfer licenses between states.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is typically required to become a Master Barber?', 'Only a basic license', 'Years of experience, advanced training, and examination', 'Payment of a fee only', 'Working in one shop for 6 months', 'b', 'Becoming a Master Barber typically requires years of practical experience, completion of advanced training programs, and passing a comprehensive examination demonstrating mastery of the craft.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 1);

-- Chapter 2 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is self-actualization?', 'Making money', 'Fulfilling your full potential', 'Getting a job', 'Graduating school', 'b', 'Self-actualization means fulfilling your full potential and becoming the best version of yourself through lifelong commitment to growth.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a mission statement?', 'A financial report', 'A statement defining your purpose and values', 'A legal document', 'A resume', 'b', 'A mission statement defines your purpose, values, and direction. It provides focus and becomes the ''cultural pulse'' of your life or business.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three bad habits to avoid?', 'Eating, sleeping, working', 'Procrastination, perfectionism, lack of organization', 'Studying, practicing, learning', 'Talking, listening, thinking', 'b', 'The three bad habits to avoid are procrastination (putting things off), perfectionism (unhealthy need for everything to be perfect), and lack of organization.', 'medium', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is procrastination?', 'Working hard', 'Putting things off; delaying tasks', 'Being organized', 'Setting goals', 'b', 'Procrastination is putting things off or delaying tasks that need to be done. It''s one of the three bad habits that can prevent success.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is perfectionism?', 'Doing excellent work', 'An unhealthy need to do everything perfectly', 'Being detail-oriented', 'Setting high standards', 'b', 'Perfectionism is an unhealthy need to do everything perfectly. It can paralyze progress and prevent completion of tasks.', 'medium', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the benefit of being well-organized?', 'It takes more time', 'It reduces stress and increases productivity', 'It costs more money', 'It requires less planning', 'b', 'Being well-organized reduces stress, increases productivity, saves time, and helps you achieve your goals more efficiently.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the ''Golden Rule'' of human relations?', 'Always be right', 'Treat others as you want to be treated', 'Put yourself first', 'Avoid conflict', 'b', 'The Golden Rule states: Treat others as you want to be treated. This principle builds trust and positive relationships.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is empathy?', 'Feeling sorry for yourself', 'Understanding and sharing the feelings of others', 'Ignoring problems', 'Being emotional', 'b', 'Empathy is the ability to understand and share the feelings of others. It''s essential for building strong client relationships in barbering.', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is emotional intelligence?', 'Being emotional', 'The ability to recognize, understand, and manage emotions', 'Having a high IQ', 'Being sensitive', 'b', 'Emotional intelligence is the ability to recognize, understand, and manage your own emotions and the emotions of others.', 'medium', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the first step in problem-solving?', 'Implementing a solution', 'Identifying and defining the problem', 'Asking for help', 'Ignoring the problem', 'b', 'The first step in problem-solving is identifying and clearly defining the problem. You cannot solve what you don''t understand.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are short-term goals?', 'Goals for retirement', 'Goals accomplished in a year or less', 'Goals that take 10 years', 'Goals without deadlines', 'b', 'Short-term goals are goals accomplished in a year or less, such as passing an exam or graduating from school.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are long-term goals?', 'Daily tasks', 'Goals that take 2, 5, 10 or more years', 'Goals for next week', 'Unimportant goals', 'b', 'Long-term goals take 2, 5, 10 or more years to accomplish, such as owning a barbershop in 5 years or building a successful career.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does SMART stand for in goal setting?', 'Speedy, Motivated, Active, Ready, Timely', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Simple, Manageable, Attainable, Realistic, Timely', 'Strategic, Meaningful, Actionable, Results-oriented, Timely', 'b', 'SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound. This framework helps create clear, attainable goals.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should goals be written down?', 'To forget them', 'To increase commitment and clarity', 'To show others', 'To make them harder', 'b', 'Writing down goals increases commitment, provides clarity, serves as a reminder, and makes you more likely to achieve them.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an action plan?', 'A list of dreams', 'A detailed breakdown of steps to achieve a goal', 'A financial report', 'A schedule', 'b', 'An action plan is a detailed breakdown of the specific steps needed to achieve a goal, including timelines and resources.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if you fail to meet a goal?', 'Give up', 'Analyze what went wrong and adjust your approach', 'Pretend it didn''t happen', 'Blame others', 'b', 'If you fail to meet a goal, analyze what went wrong, learn from the experience, adjust your approach, and try again. Failure is part of growth.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should you review your goals?', 'Once a year', 'Regularly - weekly or monthly', 'Never', 'Only when you fail', 'b', 'You should review your goals regularly - weekly or monthly - to track progress, make adjustments, and stay motivated.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between a dream and a goal?', 'Nothing', 'A goal has a plan and deadline; a dream doesn''t', 'Dreams are bigger', 'Goals are less important', 'b', 'A dream is a wish or desire, while a goal is a dream with a specific plan, deadline, and actionable steps to achieve it.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are mnemonics?', 'Computer programs', 'Memory aids like acronyms and associations', 'Study rooms', 'Textbooks', 'b', 'Mnemonics are memory aids including word associations, acronyms (like SHAPES), and songs or rhymes to help remember information.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the best environment for studying?', 'In front of the TV', 'Quiet, well-lit, organized space with minimal distractions', 'In a crowded room', 'While multitasking', 'b', 'The best study environment is quiet, well-lit, organized, and free from distractions like TV, phones, and loud noises.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is active learning?', 'Reading only', 'Engaging with material through practice, discussion, and application', 'Listening to lectures', 'Taking notes', 'b', 'Active learning involves engaging with material through practice, discussion, teaching others, and applying concepts rather than passive reading.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How long should study sessions typically be?', '8 hours straight', '25-50 minutes with breaks (Pomodoro technique)', 'All night', '5 minutes', 'b', 'Study sessions of 25-50 minutes with short breaks (the Pomodoro technique) are most effective for retention and preventing burnout.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the benefit of teaching others what you''ve learned?', 'It wastes time', 'It reinforces your own understanding', 'It confuses you', 'It''s only for teachers', 'b', 'Teaching others what you''ve learned reinforces your own understanding, identifies gaps in knowledge, and improves retention.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is spaced repetition?', 'Cramming all night', 'Reviewing material at increasing intervals over time', 'Reading once', 'Skipping reviews', 'b', 'Spaced repetition is reviewing material at increasing intervals over time, which significantly improves long-term retention.', 'hard', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is sleep important for learning?', 'It''s not important', 'It helps consolidate memories and improve retention', 'It wastes time', 'Only for rest', 'b', 'Sleep is crucial for learning because it helps consolidate memories, process information, and improve retention and recall.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is time management?', 'Wasting time', 'Planning and controlling how you spend your time', 'Working all the time', 'Being busy', 'b', 'Time management is planning and controlling how you spend your time to effectively accomplish your goals and priorities.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the 80/20 rule (Pareto Principle)?', 'Work 80 hours for 20 dollars', '80% of results come from 20% of efforts', '80% effort for 20% results', 'A time schedule', 'b', 'The 80/20 rule states that roughly 80% of results come from 20% of efforts. Focus on the high-impact activities.', 'hard', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a priority matrix?', 'A math problem', 'A tool to categorize tasks by urgency and importance', 'A calendar', 'A to-do list', 'b', 'A priority matrix (Eisenhower Matrix) categorizes tasks by urgency and importance to help focus on what truly matters.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do first: urgent tasks or important tasks?', 'Neither', 'Important tasks that are also urgent', 'Easy tasks', 'Tasks you like', 'b', 'Focus first on tasks that are both important AND urgent. Then schedule important but not urgent tasks before urgent but not important ones.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the benefit of maintaining a positive attitude?', 'It has no benefit', 'It improves problem-solving, relationships, and resilience', 'It makes you naive', 'It''s unprofessional', 'b', 'A positive attitude improves problem-solving abilities, builds better relationships, increases resilience, and attracts opportunities.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 2);

-- Chapter 3 Quiz Questions (35)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is Professional Image?', 'Your haircut style', 'The impression you project through appearance and conduct', 'Your social media presence', 'Your pricing structure', 'b', 'Professional image is the total impression you project through your appearance and conduct. It''s how you look, how you act, and how clients perceive your competence before you ever pick up your tools.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How quickly do clients form first impressions?', 'After 30 minutes', 'Within the first 7 seconds', 'After the haircut is complete', 'After reading reviews', 'b', 'Clients form first impressions within the first 7 seconds. Before you speak or touch your tools, clients have already decided if they trust you based on your appearance.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why must barbers exemplify grooming standards?', 'It''s required by law', 'Clients view barbers as grooming authorities', 'It costs less', 'It''s easier', 'b', 'Barbers must exemplify grooming standards because clients view them as grooming authorities. You are your own billboard - if you look unkempt, clients question your ability to improve their appearance.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does ''walking advertisement'' mean for barbers?', 'You need to walk to work', 'You are your own marketing', 'You should advertise while walking', 'You need business cards', 'b', 'As a ''walking advertisement,'' you are your own marketing. Every client who leaves your chair becomes a potential referral source. Your image directly impacts word-of-mouth and business growth.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the most important aspect of professional dress?', 'Wearing expensive clothes', 'Being clean, neat, and appropriate', 'Following fashion trends', 'Wearing designer labels', 'b', 'The most important aspect of professional dress is being clean, neat, and appropriate for your workplace. Expensive or trendy clothes mean nothing if they''re not clean and professional.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should a barber''s uniform be cleaned?', 'Once a week', 'Daily or when soiled', 'Once a month', 'Only when visibly dirty', 'b', 'A barber''s uniform should be cleaned daily or whenever soiled. Working with hair products, chemicals, and clients requires maintaining a fresh, clean appearance at all times.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What type of shoes are most appropriate for barbers?', 'High heels', 'Closed-toe, non-slip, comfortable shoes', 'Sandals', 'Flip-flops', 'b', 'Barbers should wear closed-toe, non-slip, comfortable shoes. You''ll be standing for long hours, and safety is important when working with sharp tools and slippery floors.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is jewelry kept minimal in barbering?', 'It''s cheaper', 'It can harbor bacteria and interfere with work', 'It''s not fashionable', 'Clients don''t like it', 'b', 'Jewelry should be minimal because it can harbor bacteria, get caught in hair, interfere with tool handling, and may scratch clients. Simple, clean accessories are best.', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is personal branding?', 'Your logo design', 'The unique professional identity you create and promote', 'Your business cards', 'Your shop''s name', 'b', 'Personal branding is the unique professional identity you create and promote. It encompasses your skills, style, values, and the consistent experience clients can expect from you.', 'medium', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How does professional image affect client retention?', 'It doesn''t matter', 'It builds trust and encourages return visits', 'It only affects new clients', 'It''s less important than price', 'b', 'Professional image directly affects client retention by building trust and confidence. Clients return to barbers who look professional, competent, and trustworthy.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the Four Personal Hygiene Habits?', 'Eating, sleeping, working, relaxing', 'Daily shower, clean hair, fresh breath, clean nails', 'Exercising, reading, socializing, studying', 'Shopping, grooming, dining, traveling', 'b', 'The Four Personal Hygiene Habits are: daily shower, clean hair, fresh breath, and clean nails. These basics build client confidence in your professionalism.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is handwashing critical for barbers?', 'It feels nice', 'It prevents disease transmission and shows professionalism', 'It''s required for tips', 'It makes hands soft', 'b', 'Handwashing is critical because it prevents disease transmission between clients and shows professionalism. It should be done before and after every service.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should barbers wash their hands?', 'Once per day', 'Before and after every client service', 'Only when visibly dirty', 'Once per hour', 'b', 'Barbers should wash their hands before and after every client service. This is a fundamental infection control practice and professional standard.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the proper way to cover a cough or sneeze?', 'Into your hands', 'Into your elbow or a tissue', 'Into the air', 'Into your apron', 'b', 'Cough or sneeze into your elbow or a tissue, then wash hands immediately. This prevents spreading germs to clients, tools, and surfaces.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should barbers stay home when sick?', 'They need rest', 'To prevent spreading illness to clients and coworkers', 'Shops require it', 'Clients complain', 'b', 'Barbers should stay home when sick to prevent spreading illness to clients and coworkers. Professional responsibility includes protecting public health.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of deodorant or antiperspirant?', 'It''s optional', 'To control body odor and maintain freshness', 'To smell like cologne', 'To attract clients', 'b', 'Deodorant or antiperspirant controls body odor and maintains freshness. Working closely with clients requires maintaining pleasant personal hygiene.', 'easy', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is oral hygiene important for barbers?', 'For kissing clients', 'You work close to clients'' faces', 'It''s not important', 'For eating lunch', 'b', 'Oral hygiene is important because barbers work close to clients'' faces during services. Bad breath is unprofessional and unpleasant for clients.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should barbers do if they have a contagious skin condition?', 'Cover it with makeup', 'Seek treatment and avoid client contact until cleared', 'Work carefully', 'Tell clients to be careful', 'b', 'Barbers with contagious skin conditions should seek treatment and avoid client contact until cleared by a healthcare provider. This protects both clients and the barber''s reputation.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should work uniforms be replaced?', 'Never', 'When worn, stained, or no longer professional', 'Every 10 years', 'Only when torn', 'b', 'Work uniforms should be replaced when worn, stained, faded, or no longer presenting a professional appearance. First impressions matter.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the best practice for fingernails in barbering?', 'Long and decorated', 'Short, clean, and unpolished or neutral', 'Any style is fine', 'Long and natural', 'b', 'Fingernails should be short, clean, and either unpolished or with neutral polish. Long or decorated nails can harbor bacteria and scratch clients.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is Ergonomics?', 'A type of exercise', 'Science of designing workplace for comfort, efficiency, and safety', 'A brand of tools', 'A haircutting technique', 'b', 'Ergonomics is the science of designing the workplace for comfort, efficiency, and safety. Proper ergonomics prevents career-ending injuries.', 'easy', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What causes Musculoskeletal Disorders (MSDs)?', 'Genetics only', 'Repetitive motions and poor posture', 'Eating habits', 'Age only', 'b', 'Musculoskeletal Disorders are caused by repetitive motions and poor posture. Cutting hair, holding tools, and standing all day can injure muscles, nerves, and joints.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is good posture important for barbers?', 'It looks nice', 'It prevents back pain and career-ending injuries', 'It''s required', 'Clients notice', 'b', 'Good posture prevents back pain, neck strain, and career-ending injuries. How you stand, hold tools, and position clients affects your long-term health.', 'easy', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the proper height for a barber chair?', 'As low as possible', 'Adjusted so you don''t bend or reach excessively', 'As high as possible', 'Fixed height for everyone', 'b', 'The barber chair should be adjusted so you don''t bend or reach excessively. Proper positioning prevents strain on your back, shoulders, and neck.', 'medium', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is repetitive strain injury (RSI)?', 'A type of haircut', 'Damage to muscles and nerves from repeated motions', 'A tool brand', 'A skin condition', 'b', 'Repetitive Strain Injury is damage to muscles, nerves, and tendons from repeated motions. Barbers are at risk from cutting, holding tools, and standing.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How can barbers prevent carpal tunnel syndrome?', 'Ignore symptoms', 'Use proper grip, take breaks, and do wrist exercises', 'Work faster', 'Use heavier tools', 'b', 'Barbers can prevent carpal tunnel syndrome by using proper grip on tools, taking regular breaks, doing wrist exercises, and maintaining good posture.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the proper way to hold shears?', 'With a tight fist', 'Relaxed grip with thumb and ring finger in holes', 'Any way that feels comfortable', 'With all fingers', 'b', 'Hold shears with a relaxed grip, thumb in one hole and ring finger in the other. This reduces strain and allows precise control without excessive grip force.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should barbers take regular breaks?', 'To check phones', 'To rest muscles and prevent fatigue and injury', 'To talk to coworkers', 'It''s not necessary', 'b', 'Regular breaks allow muscles to rest and prevent fatigue and injury. Standing and cutting hair for hours without breaks leads to strain and MSDs.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is Body Language?', 'Sign language', 'Nonverbal communication through posture, gestures, and expressions', 'Written notes', 'Phone calls', 'b', 'Body language is nonverbal communication through posture, gestures, and facial expressions. Your body speaks louder than words and conveys confidence and professionalism.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is Confidentiality?', 'Sharing client stories', 'Keeping client information private', 'Posting on social media', 'Telling coworkers', 'b', 'Confidentiality means keeping client information private. What happens in your chair stays in your chair - personal details shared during services must never be repeated.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is active listening important?', 'It''s not important', 'It ensures you understand client needs and builds trust', 'It passes time', 'It''s required by law', 'b', 'Active listening ensures you understand client needs and builds trust. Paying full attention, asking clarifying questions, and confirming understanding leads to better results.', 'easy', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if a client is unhappy with their haircut?', 'Argue with them', 'Listen, apologize, and offer to fix it professionally', 'Ignore them', 'Charge them more', 'b', 'If a client is unhappy, listen to their concerns, apologize sincerely, and offer to fix it professionally. How you handle complaints shows your professionalism.', 'medium', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is professional distance?', 'Standing far away', 'Maintaining appropriate boundaries with clients', 'Being cold', 'Not talking to clients', 'b', 'Professional distance means maintaining appropriate boundaries with clients. Be friendly and warm while keeping relationships professional, not personal.', 'medium', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is it unprofessional to gossip about clients?', 'It''s fun', 'It violates confidentiality and trust', 'It''s entertaining', 'Everyone does it', 'b', 'Gossiping about clients violates confidentiality and trust. It damages your reputation, the shop''s reputation, and betrays the client relationship.', 'easy', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the best response to a client''s personal problems?', 'Give advice immediately', 'Listen empathetically without giving unqualified advice', 'Ignore them', 'Share your own problems', 'b', 'Listen empathetically without giving unqualified advice. Be supportive but remember you''re a barber, not a counselor. Refer serious issues to professionals.', 'medium', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 3);

-- Chapter 4 Quiz Questions (40)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two main types of bacteria?', 'Good and bad', 'Pathogenic and nonpathogenic', 'Active and dormant', 'Large and small', 'b', 'The two main types of bacteria are pathogenic (disease-causing) and nonpathogenic (harmless or beneficial). Pathogenic bacteria are the concern in barbering.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between pathogenic and nonpathogenic bacteria?', 'Size only', 'Pathogenic causes disease; nonpathogenic is harmless', 'Color difference', 'Location only', 'b', 'Pathogenic bacteria cause disease and infection, while nonpathogenic bacteria are harmless or even beneficial. In barbering, we focus on controlling pathogenic bacteria.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the most common way bacteria spread in a barbershop?', 'Through the air', 'Unclean hands and implements', 'By talking', 'Through water pipes', 'b', 'The most common way bacteria spread in a barbershop is through unclean hands and implements. Proper sanitation and disinfection are essential to prevent transmission.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are cocci bacteria?', 'Rod-shaped', 'Round-shaped', 'Spiral-shaped', 'Square-shaped', 'b', 'Cocci bacteria are round-shaped. They can appear singly, in pairs (diplococci), in chains (streptococci), or in clusters (staphylococci).', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are bacilli bacteria?', 'Round-shaped', 'Rod-shaped', 'Spiral-shaped', 'Star-shaped', 'b', 'Bacilli bacteria are rod-shaped. Many disease-causing bacteria are bacilli, including those causing tetanus and tuberculosis.', 'medium', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are spirilla bacteria?', 'Round-shaped', 'Rod-shaped', 'Spiral-shaped', 'Cube-shaped', 'c', 'Spirilla bacteria are spiral-shaped or corkscrew-shaped. They move with a twisting motion and include bacteria that cause syphilis.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the process of bacteria multiplying called?', 'Photosynthesis', 'Binary fission', 'Mitosis', 'Fermentation', 'b', 'Bacteria multiply through binary fission, where one cell divides into two identical cells. This can happen rapidly under ideal conditions.', 'medium', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How quickly can bacteria multiply under ideal conditions?', 'Every 24 hours', 'Every 20-30 minutes', 'Every week', 'Every year', 'b', 'Under ideal conditions (warmth, moisture, nutrients), bacteria can multiply every 20-30 minutes. This rapid growth is why sanitation must be immediate and thorough.', 'hard', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a bacterial spore?', 'A type of virus', 'A dormant, resistant form of bacteria', 'A cleaning product', 'A type of disinfectant', 'b', 'A bacterial spore is a dormant, resistant form that some bacteria create to survive harsh conditions. Spores are highly resistant to disinfectants and heat.', 'hard', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which bacteria cause staph infections?', 'Streptococcus', 'Staphylococcus', 'Salmonella', 'E. coli', 'b', 'Staphylococcus bacteria cause staph infections. These can range from minor skin infections to serious, life-threatening conditions like MRSA.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the main difference between bacteria and viruses?', 'Size only', 'Viruses need host cells to reproduce; bacteria don''t', 'Color difference', 'Viruses are larger', 'b', 'Viruses cannot reproduce on their own and need host cells to multiply. Bacteria are living organisms that can reproduce independently. This difference affects how we control them.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What virus causes hepatitis B?', 'HIV', 'HBV', 'HCV', 'HPV', 'b', 'HBV (Hepatitis B Virus) causes hepatitis B, a serious liver infection. It''s one of the main bloodborne pathogens barbers must protect against.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What virus causes hepatitis C?', 'HIV', 'HBV', 'HCV', 'HSV', 'c', 'HCV (Hepatitis C Virus) causes hepatitis C, another serious liver infection. Like HBV, it spreads through blood-to-blood contact.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What virus causes HIV/AIDS?', 'HBV', 'HCV', 'HIV', 'HPV', 'c', 'HIV (Human Immunodeficiency Virus) causes AIDS. It attacks the immune system and is transmitted through blood, sexual contact, and from mother to child.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Can viruses be treated with antibiotics?', 'Yes, always', 'No, antibiotics only work on bacteria', 'Sometimes', 'Only with special antibiotics', 'b', 'Viruses cannot be treated with antibiotics. Antibiotics only work on bacteria. Viral infections require antiviral medications or vaccines for prevention.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How are viruses primarily transmitted in barbershops?', 'Through the air', 'Blood-to-blood contact', 'By shaking hands', 'Through talking', 'b', 'Viruses like HIV and hepatitis are primarily transmitted through blood-to-blood contact in barbershops. This can occur through cuts, nicks, or contaminated tools.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the most effective way to prevent viral transmission?', 'Wearing gloves only', 'Universal precautions', 'Washing hands only', 'Using masks', 'b', 'Universal precautions - treating all blood and bodily fluids as potentially infectious - is the most effective way to prevent viral transmission. This includes gloves, proper sanitation, and safe needle practices.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which disinfectant is effective against HIV?', 'Water', 'EPA-registered hospital-grade disinfectant', 'Soap only', 'Alcohol only', 'b', 'EPA-registered hospital-grade disinfectants are effective against HIV when used according to manufacturer instructions. Not all disinfectants kill viruses.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between sanitation and disinfection?', 'They are the same', 'Sanitation cleans; disinfection kills germs', 'Sanitation kills; disinfection cleans', 'Neither is important', 'b', 'Sanitation (cleaning) removes visible dirt and debris. Disinfection kills microorganisms. You must clean before disinfecting - dirt protects germs from disinfectants.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What level of disinfectant is required for barbering tools?', 'Household cleaner', 'Hospital-grade, EPA-registered', 'Water only', 'Soap and water', 'b', 'Barbering tools require hospital-grade, EPA-registered disinfectants. These are proven effective against the pathogens encountered in barbershops.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How long should implements be immersed in disinfectant?', '30 seconds', 'Per manufacturer instructions, typically 10 minutes', '1 hour', '24 hours', 'b', 'Implements must be immersed for the time specified by the disinfectant manufacturer, typically 10 minutes. Cutting this time short reduces effectiveness.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done before disinfecting implements?', 'Nothing', 'Clean and remove all debris', 'Rinse with hot water only', 'Dry completely', 'b', 'You must clean implements and remove all visible debris before disinfecting. Dirt, hair, and oils protect germs and prevent disinfectant contact.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should disinfectant solutions be changed?', 'Once per week', 'When visibly dirty or per schedule', 'Once per month', 'Never', 'b', 'Disinfectant solutions should be changed when visibly dirty or according to a regular schedule. Contaminated solution won''t disinfect properly.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between disinfection and sterilization?', 'They are the same', 'Disinfection kills most; sterilization kills all organisms', 'Sterilization is faster', 'Disinfection is stronger', 'b', 'Disinfection kills most pathogenic organisms. Sterilization destroys ALL microbial life, including spores. Sterilization is required when skin is broken.', 'medium', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When is sterilization required?', 'For all tools', 'When skin is broken or blood is present', 'Only for combs', 'Never in barbering', 'b', 'Sterilization is required when skin is broken or blood is present. This includes any tools that contact blood or penetrate skin.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an autoclave?', 'A type of disinfectant', 'Device using steam under pressure to sterilize', 'A cleaning cloth', 'A type of bacteria', 'b', 'An autoclave is a device that uses steam under pressure to sterilize tools and equipment. It''s the gold standard for sterilization in professional settings.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What temperature does an autoclave reach?', '100°F', '250-270°F (121-132°C)', '150°F', '500°F', 'b', 'Autoclaves reach 250-270°F (121-132°C) under pressure. This high temperature kills all microorganisms, including resistant bacterial spores.', 'hard', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How long does autoclave sterilization take?', '1 minute', '15-30 minutes depending on cycle', '2 hours', '24 hours', 'b', 'Autoclave sterilization typically takes 15-30 minutes depending on the cycle and load. This includes heating, sterilizing, and cooling phases.', 'hard', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is dry heat sterilization?', 'Air drying', 'Uses hot air instead of steam', 'Sunlight exposure', 'Room temperature drying', 'b', 'Dry heat sterilization uses hot air instead of steam. It takes longer than autoclaving but is suitable for items that moisture could damage.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a sanitizer?', 'Same as disinfectant', 'Reduces bacteria to safe levels but doesn''t kill all', 'Kills all organisms', 'Only for floors', 'b', 'A sanitizer reduces bacteria to safe levels but doesn''t kill all organisms. It''s used for surfaces that contact intact skin, not for tools that contact blood.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are bloodborne pathogens?', 'Bacteria in water', 'Disease-causing microorganisms in blood', 'Airborne viruses', 'Food contaminants', 'b', 'Bloodborne pathogens are disease-causing microorganisms present in human blood. They include HIV, hepatitis B, and hepatitis C.', 'easy', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the OSHA Bloodborne Pathogens Standard?', 'A cleaning product', 'Regulation protecting workers from blood exposure', 'A type of disinfectant', 'A medical procedure', 'b', 'The OSHA Bloodborne Pathogens Standard is a federal regulation that protects workers from occupational exposure to bloodborne pathogens. It requires specific safety practices.', 'medium', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an exposure control plan?', 'A marketing strategy', 'Written plan to eliminate/minimize exposure', 'A type of insurance', 'A cleaning schedule', 'b', 'An exposure control plan is a written plan that identifies jobs with exposure risk and details how the employer will eliminate or minimize exposure to bloodborne pathogens.', 'medium', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are universal precautions?', 'Special precautions for known infections', 'Treat all blood as potentially infectious', 'Precautions only for doctors', 'No precautions needed', 'b', 'Universal precautions mean treating ALL blood and certain bodily fluids as potentially infectious, regardless of the source. This protects against unknown infections.', 'easy', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What PPE is required when handling blood?', 'None', 'Gloves minimum, possibly more', 'Only masks', 'Only goggles', 'b', 'At minimum, gloves are required when handling blood. Depending on the situation, masks, eye protection, and gowns may also be necessary.', 'easy', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done after exposure to blood?', 'Ignore it', 'Wash area, report incident, seek medical evaluation', 'Wait and see', 'Clean with water only', 'b', 'After blood exposure: wash the area thoroughly with soap and water, report the incident immediately, and seek medical evaluation for potential post-exposure treatment.', 'medium', 35
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the proper disposal method for sharps?', 'Regular trash', 'FDA-approved sharps container', 'Recycling bin', 'Sink disposal', 'b', 'Sharps (razors, blades, needles) must be disposed of in FDA-approved sharps containers. These puncture-resistant containers prevent injury and transmission.', 'easy', 36
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should contaminated surfaces be cleaned?', 'Water only', 'Disinfectant effective against bloodborne pathogens', 'Soap only', 'Air dry', 'b', 'Contaminated surfaces should be cleaned with disinfectants proven effective against bloodborne pathogens (HBV and HIV), used according to manufacturer instructions.', 'easy', 37
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What documentation is required after an exposure incident?', 'None', 'Incident report and medical records', 'Only verbal report', 'Social media post', 'b', 'After an exposure incident, you must complete an incident report and maintain medical records. Documentation is required by OSHA and for potential workers'' compensation.', 'medium', 38
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How long must exposure records be kept?', '1 year', 'Duration of employment plus 30 years', '6 months', '10 years', 'b', 'OSHA requires exposure records to be kept for the duration of employment plus 30 years. This long retention is because diseases like hepatitis may not show symptoms for years.', 'hard', 39
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 4);

-- Chapter 5 Quiz Questions (35)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a straight razor also called?', 'Safety razor', 'Cut-throat razor', 'Electric razor', 'Disposable razor', 'b', 'A straight razor is also called a cut-throat razor due to its exposed blade that can cut if not handled properly. It requires skill and proper technique to use safely.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two main parts of a straight razor?', 'Blade and handle only', 'Blade and scales (handle)', 'Blade and guard', 'Handle and guard', 'b', 'The two main parts of a straight razor are the blade and the scales (handle). The scales fold over the blade for protection when not in use.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of a razor strop?', 'To disinfect the razor', 'To polish and align the blade edge', 'To store the razor', 'To sharpen a dull blade', 'b', 'A razor strop is used to polish and align the blade edge between shaves. It''s made of leather or canvas and helps maintain the razor''s sharpness.', 'medium', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is honing a razor?', 'Cleaning the razor', 'Sharpening the blade on a whetstone', 'Stropping the razor', 'Disinfecting the razor', 'b', 'Honing is the process of sharpening a razor blade on a whetstone or hone. This removes metal and creates a new edge, unlike stropping which just aligns the existing edge.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should a straight razor be stored?', 'Blade open to air dry', 'Clean, dry, and lightly oiled with blade closed', 'In water', 'In a disinfectant solution', 'b', 'A straight razor should be stored clean, completely dry, and lightly oiled with the blade closed. This prevents rust and protects the edge.', 'medium', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the bevel of a razor blade?', 'The handle', 'The angle at which the blade is ground', 'The scales', 'The pivot pin', 'b', 'The bevel is the angle at which the blade is ground. Different bevel angles affect how the blade cuts and how it must be honed and stropped.', 'hard', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a safety razor?', 'A razor that cannot cut', 'A razor with a guard to protect the skin', 'A disposable razor', 'An electric razor', 'b', 'A safety razor has a guard that protects the skin from the blade, making it safer to use than a straight razor while still providing a close shave.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should a straight razor be stropped?', 'Once a month', 'Before each use', 'Once a year', 'Never', 'b', 'A straight razor should be stropped before each use to align the edge and ensure a smooth, comfortable shave. Proper stropping is essential for razor performance.', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What indicates a razor needs honing?', 'It looks dirty', 'It pulls hair or feels dull', 'It''s been a week', 'The client complains', 'b', 'A razor needs honing when it pulls hair, feels dull, or doesn''t cut smoothly. Stropping maintains the edge, but honing is needed when the edge becomes truly dull.', 'medium', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two main types of clipper motors?', 'Fast and slow', 'Magnetic and rotary', 'Electric and battery', 'Large and small', 'b', 'The two main types of clipper motors are magnetic (vibrating at high speed) and rotary (spinning motion). Each has different characteristics for cutting performance.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between clippers and trimmers?', 'There is no difference', 'Clippers cut bulk hair; trimmers detail and edge', 'Clippers are electric; trimmers are manual', 'Trimmers are larger', 'b', 'Clippers are designed to cut bulk hair and larger areas. Trimmers are smaller, more precise tools for detailing, edging, and creating clean lines.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should clipper blades be oiled?', 'Once a week', 'Before each use and during extended use', 'Once a month', 'Never', 'b', 'Clipper blades should be oiled before each use and periodically during extended use. Oiling reduces friction, heat, and wear while ensuring smooth cutting.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What causes clipper blades to get hot?', 'Using them', 'Friction from lack of oil or dull blades', 'Being plugged in', 'The motor type', 'b', 'Clipper blades get hot from friction, usually caused by lack of oil or dull blades. Hot blades can burn clients and damage hair. Regular oiling prevents this.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of clipper guards?', 'To protect the clipper', 'To control hair length', 'To make it quieter', 'To change the motor speed', 'b', 'Clipper guards (attachments) control the length of hair being cut. They snap onto the blade and create a barrier that determines how much hair is removed.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should clipper blades be disinfected?', 'Wipe with water', 'Spray with EPA-registered disinfectant or immerse per manufacturer', 'Wipe with a dry cloth', 'Rinse under tap', 'b', 'Clipper blades should be disinfected by spraying with EPA-registered disinfectant or immersing according to manufacturer instructions. Follow contact time requirements.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is zero-gap on a clipper?', 'No gap at all', 'Blade adjustment for closest cut', 'A broken clipper', 'A type of guard', 'b', 'Zero-gap is a blade adjustment where the cutting blade is set very close to the stationary blade for the closest possible cut. This requires skill to avoid cutting skin.', 'hard', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why do clipper blades need to be aligned?', 'They don''t', 'To ensure proper cutting and prevent pulling hair', 'To make them quieter', 'To change the speed', 'b', 'Clipper blades must be properly aligned to ensure smooth cutting and prevent pulling or snagging hair. Misaligned blades cause discomfort and poor results.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between taper and fade clippers?', 'No difference', 'Taper clippers have adjustable blades; fades require specific technique', 'Taper is manual; fade is electric', 'Fade clippers are larger', 'b', 'Taper clippers have adjustable blades that can be moved closer or farther from the skin. Fades are created using various tools and techniques to blend hair to the skin.', 'hard', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between shears and scissors?', 'No difference', 'Shears are 6+ inches with finger rest; scissors are smaller', 'Shears are cheaper', 'Scissors are for barbers; shears for stylists', 'b', 'Shears are typically 6 inches or longer with a finger rest/tang. Scissors are smaller. In barbering, ''shears'' is the preferred term for professional cutting tools.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two holes in shears called?', 'Holes', 'Finger hole and thumb hole', 'Rings', 'Grips', 'b', 'The two holes in shears are the finger hole (larger, for multiple fingers) and the thumb hole (smaller, for the thumb). Proper finger placement is essential for control.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the tang on shears?', 'The blade', 'The removable or fixed finger rest', 'The screw', 'The tip', 'b', 'The tang is the finger rest on shears, either removable or fixed. It provides support and control, reducing hand fatigue during extended cutting.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should shears be held?', 'With a tight fist', 'Thumb in smaller hole, fingers in larger hole with relaxed grip', 'Any way that feels comfortable', 'Only by the blades', 'b', 'Hold shears with your thumb in the smaller hole and fingers (usually ring and middle) in the larger hole with a relaxed grip. This allows smooth, controlled cutting.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of the shear screw?', 'Decoration', 'To adjust blade tension', 'To hold the handle', 'To sharpen the blade', 'b', 'The shear screw (pivot screw) adjusts blade tension. Proper tension allows smooth opening and closing without blades being too loose or too tight.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should shears be cleaned?', 'Immerse in water', 'Wipe clean, disinfect, and oil the screw area', 'Use soap and water', 'Leave hair on them', 'b', 'Clean shears by wiping off hair and debris, disinfecting according to regulations, and oiling the screw area. Never immerse shears in liquid unless manufacturer approved.', 'medium', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What indicates shears need sharpening?', 'They look old', 'They fold or push hair instead of cutting cleanly', 'They are shiny', 'They make noise', 'b', 'Shears need sharpening when they fold or push hair instead of cutting cleanly. Dull shears damage hair and make cutting difficult. Professional sharpening is required.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are thinning shears used for?', 'To cut all hair', 'To remove bulk and blend without changing length significantly', 'To cut faster', 'Only for long hair', 'b', 'Thinning shears (texturizing shears) have teeth on one blade and remove bulk while blending. They reduce volume without significantly changing overall hair length.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a neck duster used for?', 'To cut hair', 'To remove loose hair from neck and face', 'To apply products', 'To comb hair', 'b', 'A neck duster (barber brush) is used to remove loose hair from the client''s neck, face, and ears after cutting. It has soft bristles for comfort.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of a barber comb?', 'Decoration', 'To hold hair while cutting and guide clippers/shears', 'To clean tools', 'To apply color', 'b', 'A barber comb holds hair at consistent tension while cutting and guides clippers or shears. Different combs have different tooth spacing for various hair types and techniques.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a cape used for?', 'Fashion', 'To protect client''s clothing from hair and products', 'To keep client warm', 'To dry hair', 'b', 'A barber cape protects the client''s clothing from hair clippings, water, and products. It should be sanitized between clients according to health regulations.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should tools be stored?', 'In a drawer loose', 'Clean, dry, and organized to prevent damage', 'In water', 'On the floor', 'b', 'Tools should be stored clean, dry, and organized to prevent damage, cross-contamination, and accidents. Proper storage extends tool life and maintains hygiene.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a blade guard?', 'A type of clipper', 'A protective cover for clipper blades when not in use', 'A type of shear', 'A disinfectant', 'b', 'A blade guard is a protective cover for clipper blades when not in use. It protects the blade from damage and prevents accidental cuts.', 'easy', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is tool maintenance important?', 'It''s not important', 'Ensures performance, longevity, and client safety', 'Only for expensive tools', 'Just for appearance', 'b', 'Tool maintenance ensures optimal performance, extends tool life, and maintains client safety. Well-maintained tools cut better and reduce risk of injury or infection.', 'easy', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done with damaged tools?', 'Continue using them', 'Repair or replace them immediately', 'Hide them', 'Give them to clients', 'b', 'Damaged tools should be repaired or replaced immediately. Using damaged tools can harm clients, spread infection, and produce poor results.', 'easy', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a sanitizer jar used for?', 'To store clean tools', 'To disinfect combs and some implements', 'To hold water', 'To display products', 'b', 'A sanitizer jar holds disinfectant solution for immersing and disinfecting combs and some implements. Follow manufacturer instructions for proper disinfection.', 'medium', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should electrical tools be inspected?', 'Never', 'Regularly for cord damage and proper function', 'Only when broken', 'Once a year only', 'b', 'Electrical tools should be inspected regularly for cord damage, proper function, and safety. Damaged cords or malfunctioning tools pose fire and shock hazards.', 'medium', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 5);

-- Chapter 6 Quiz Questions (35)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the basic unit of life?', 'Tissue', 'Cell', 'Organ', 'System', 'b', 'The cell is the basic unit of life. All living things are made of cells, and cells perform all the functions necessary for life.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three main parts of a cell?', 'Head, body, tail', 'Nucleus, cytoplasm, cell membrane', 'Skin, bone, muscle', 'Blood, lymph, nerve', 'b', 'The three main parts of a cell are the nucleus (control center), cytoplasm (fluid interior), and cell membrane (outer boundary).', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does the nucleus do?', 'Produces energy', 'Controls cell activities and contains DNA', 'Removes waste', 'Protects the cell', 'b', 'The nucleus controls cell activities and contains DNA (genetic material). It''s the ''brain'' of the cell that directs all functions.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a tissue?', 'A single cell', 'A group of similar cells that perform a specific function', 'An organ', 'A body system', 'b', 'A tissue is a group of similar cells that work together to perform a specific function. Examples include muscle tissue and skin tissue.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the four basic types of tissue?', 'Blood, bone, muscle, skin', 'Connective, epithelial, muscle, nervous', 'Red, white, blue, yellow', 'Large, small, medium, tiny', 'b', 'The four basic types of tissue are: connective (supports/connects), epithelial (covers), muscle (movement), and nervous (communication).', 'medium', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is epithelial tissue?', 'Muscle tissue', 'Tissue that covers and protects body surfaces', 'Nerve tissue', 'Blood tissue', 'b', 'Epithelial tissue covers and protects body surfaces, both inside and outside. Skin is epithelial tissue, as is the lining of internal organs.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is connective tissue?', 'Brain tissue', 'Tissue that supports, connects, or separates other tissues', 'Heart tissue', 'Lung tissue', 'b', 'Connective tissue supports, connects, or separates other tissues and organs. Examples include bone, cartilage, fat, and blood.', 'medium', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is mitosis?', 'Cell death', 'Cell division that creates two identical cells', 'Cell eating', 'Cell movement', 'b', 'Mitosis is cell division that creates two identical daughter cells. It''s how the body grows and repairs tissues by making new cells.', 'hard', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How many major body systems are there?', '5', '11', '20', '3', 'b', 'There are 11 major body systems that work together to maintain life. These include circulatory, respiratory, digestive, nervous, and others.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is homeostasis?', 'A type of exercise', 'The body''s ability to maintain stable internal conditions', 'A disease', 'A vitamin', 'b', 'Homeostasis is the body''s ability to maintain stable internal conditions (temperature, pH, fluids) despite external changes. All systems work to maintain balance.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is metabolism?', 'Sleeping', 'All chemical processes that occur in the body', 'Only digestion', 'Only breathing', 'b', 'Metabolism includes all chemical processes that occur in the body to maintain life. It includes breaking down food for energy (catabolism) and building tissues (anabolism).', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of the skeletal system?', 'Only movement', 'Support, protection, movement, and blood cell production', 'Only breathing', 'Only digestion', 'b', 'The skeletal system provides support, protects organs, enables movement (with muscles), produces blood cells, and stores minerals.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of the muscular system?', 'Only pumping blood', 'Movement, posture, and heat production', 'Only breathing', 'Only thinking', 'b', 'The muscular system enables movement, maintains posture, stabilizes joints, and generates heat. Muscles work with bones to create movement.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of the circulatory system?', 'Only breathing', 'Transporting blood, nutrients, oxygen, and waste', 'Only digestion', 'Only thinking', 'b', 'The circulatory system transports blood throughout the body, delivering oxygen and nutrients to cells and removing waste products.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of the nervous system?', 'Only movement', 'Controlling and coordinating body activities through electrical signals', 'Only digestion', 'Only breathing', 'b', 'The nervous system controls and coordinates all body activities through electrical signals. It includes the brain, spinal cord, and nerves.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of the respiratory system?', 'Only pumping blood', 'Bringing in oxygen and removing carbon dioxide', 'Only digestion', 'Only movement', 'b', 'The respiratory system brings oxygen into the body and removes carbon dioxide. It includes the lungs, trachea, and breathing muscles.', 'easy', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of the digestive system?', 'Only breathing', 'Breaking down food into nutrients the body can use', 'Only movement', 'Only thinking', 'b', 'The digestive system breaks down food into nutrients the body can absorb and use for energy, growth, and repair. It includes the mouth, stomach, and intestines.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How many bones are in the adult human body?', '106', '206', '306', '50', 'b', 'The adult human body has 206 bones. Babies are born with about 270 bones, but many fuse together as they grow.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the longest bone in the body?', 'Spine', 'Femur (thigh bone)', 'Arm bone', 'Skull', 'b', 'The femur (thigh bone) is the longest and strongest bone in the body. It extends from the hip to the knee.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of muscles?', 'Only support', 'Movement, maintaining posture, and producing heat', 'Only protection', 'Only blood production', 'b', 'Muscles enable movement, maintain posture, stabilize joints, and produce heat. They work by contracting (shortening) and relaxing.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three types of muscle tissue?', 'Red, white, and blue', 'Skeletal, smooth, and cardiac', 'Large, medium, and small', 'Strong, weak, and average', 'b', 'The three types of muscle tissue are: skeletal (voluntary movement), smooth (involuntary, in organs), and cardiac (heart muscle).', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is skeletal muscle?', 'Heart muscle', 'Voluntary muscle attached to bones', 'Stomach muscle', 'Brain muscle', 'b', 'Skeletal muscle is voluntary muscle attached to bones. You control these muscles consciously to move your body.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is smooth muscle?', 'Heart muscle', 'Involuntary muscle in internal organs', 'Bone muscle', 'Skin muscle', 'b', 'Smooth muscle is involuntary muscle found in internal organs like the stomach and intestines. It works automatically without conscious control.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is cardiac muscle?', 'Arm muscle', 'Heart muscle', 'Leg muscle', 'Back muscle', 'b', 'Cardiac muscle is the specialized muscle tissue of the heart. It contracts rhythmically to pump blood throughout the body.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What connects muscle to bone?', 'Ligaments', 'Tendons', 'Cartilage', 'Joints', 'b', 'Tendons are strong, fibrous tissues that connect muscle to bone. They transmit the force of muscle contraction to create movement.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What connects bone to bone?', 'Tendons', 'Ligaments', 'Muscles', 'Cartilage', 'b', 'Ligaments are strong, fibrous tissues that connect bone to bone at joints. They provide stability and prevent excessive movement.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two main parts of the nervous system?', 'Brain and heart', 'Central nervous system and peripheral nervous system', 'Muscles and bones', 'Skin and hair', 'b', 'The two main parts are the central nervous system (brain and spinal cord) and the peripheral nervous system (nerves throughout the body).', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the function of the brain?', 'Only breathing', 'Controlling thoughts, memory, emotions, and body functions', 'Only digestion', 'Only movement', 'b', 'The brain controls thoughts, memory, emotions, touch, motor skills, vision, breathing, temperature, hunger, and every process that regulates our body.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the spinal cord?', 'A bone', 'The highway for messages between brain and body', 'A muscle', 'A blood vessel', 'b', 'The spinal cord is the highway for messages between the brain and the rest of the body. It carries signals for movement and sensation.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are neurons?', 'Blood cells', 'Nerve cells that transmit information', 'Muscle cells', 'Skin cells', 'b', 'Neurons are specialized nerve cells that transmit information throughout the body via electrical and chemical signals.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the heart?', 'A muscle', 'A muscular organ that pumps blood', 'A bone', 'A gland', 'b', 'The heart is a muscular organ that pumps blood throughout the body. It beats about 100,000 times per day to circulate blood.', 'easy', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are arteries?', 'Blood vessels that carry blood away from the heart', 'Blood vessels that carry blood to the heart', 'Nerves', 'Muscles', 'a', 'Arteries are blood vessels that carry oxygen-rich blood away from the heart to the rest of the body. They have thick, muscular walls.', 'medium', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are veins?', 'Blood vessels that carry blood to the heart', 'Blood vessels that carry blood away from the heart', 'Nerves', 'Bones', 'a', 'Veins are blood vessels that carry blood back to the heart. They have valves to prevent backflow and are closer to the skin surface.', 'medium', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are capillaries?', 'Large blood vessels', 'Tiny blood vessels where exchange occurs', 'Nerves', 'Muscles', 'b', 'Capillaries are tiny, thin-walled blood vessels where oxygen, nutrients, and waste are exchanged between blood and body cells.', 'medium', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is blood made of?', 'Only red liquid', 'Plasma, red blood cells, white blood cells, and platelets', 'Only water', 'Only cells', 'b', 'Blood is made of plasma (liquid), red blood cells (carry oxygen), white blood cells (fight infection), and platelets (clotting).', 'medium', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 6);

-- Chapter 7 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is chemistry?', 'The study of living things', 'The science dealing with composition, structure, and properties of matter', 'The study of the earth', 'The study of space', 'b', 'Chemistry is the science that deals with the composition, structure, and properties of matter. It helps us understand how barbering products work and interact with hair.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does organic chemistry study?', 'Rocks and minerals', 'Substances containing carbon', 'Metals only', 'Water only', 'b', 'Organic chemistry studies substances containing carbon. All living things are carbon-based, including human hair and skin.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does inorganic chemistry study?', 'Living things', 'Substances without carbon', 'Only water', 'Only metals', 'b', 'Inorganic chemistry studies substances without carbon. This includes water, minerals, metals, and many disinfectants used in barbering.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which substances will burn?', 'Most inorganic substances', 'Most organic substances', 'Only water', 'Only metals', 'b', 'Most organic substances will burn because they contain carbon. Carbon-based materials are combustible, while inorganic substances typically don''t burn.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is matter?', 'Only solid things', 'Anything that occupies space and has mass', 'Only liquids', 'Only gases', 'b', 'Matter is anything that occupies space and has mass (weight). Everything around us - hair, products, tools - is matter.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are physical properties?', 'Properties that change the substance', 'Characteristics determined without chemical reaction', 'Only color and smell', 'Properties that create new substances', 'b', 'Physical properties are characteristics that can be determined without a chemical reaction. Examples include color, odor, weight, density, and melting point.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are chemical properties?', 'Properties you can see', 'Characteristics determined by chemical reaction', 'Only physical appearance', 'Properties that don''t change', 'b', 'Chemical properties are characteristics that can only be determined by chemical reaction. Examples include how a substance reacts with acid or its flammability.', 'medium', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between physical and chemical change?', 'No difference', 'Physical changes form; chemical changes create new substances', 'Physical is faster', 'Chemical is reversible', 'b', 'Physical changes alter form without creating new substances (melting ice, cutting hair). Chemical changes create new substances with different properties (burning, rusting).', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How many states of matter exist?', 'Two', 'Three (solid, liquid, gas)', 'Four', 'Five', 'b', 'Three states of matter exist: solid, liquid, and gas. Matter can change between states through heating or cooling.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which state has definite shape and volume?', 'Liquid', 'Solid', 'Gas', 'Plasma', 'b', 'Solids have definite shape and volume. Examples in barbering include styling wax, soap bars, and solid disinfectants.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which state has volume but no definite shape?', 'Solid', 'Liquid', 'Gas', 'All states', 'b', 'Liquids have volume but no definite shape - they take the shape of their container. Examples include shampoos, conditioners, and tonics.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which state has no definite shape or volume?', 'Solid', 'Liquid', 'Gas', 'Liquid and solid', 'c', 'Gases have no definite shape or volume - they expand to fill their container. Examples include steam and aerosol sprays.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an element?', 'A mixture of substances', 'The simplest form of chemical matter', 'A compound', 'A solution', 'b', 'An element is the simplest form of chemical matter. It cannot be broken down into simpler substances by ordinary means.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an atom?', 'A molecule', 'The basic building block of all matter', 'A cell', 'A compound', 'b', 'An atom is the basic building block of all matter. It''s the smallest unit of an element that retains its properties.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three main parts of an atom?', 'Head, body, tail', 'Protons, neutrons, and electrons', 'Solid, liquid, gas', 'Top, middle, bottom', 'b', 'The three main parts of an atom are protons (positive charge), neutrons (no charge), and electrons (negative charge). Protons and neutrons are in the nucleus; electrons orbit around it.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a molecule?', 'A single atom', 'Two or more atoms chemically combined', 'An element', 'A mixture', 'b', 'A molecule is two or more atoms chemically combined. It can be atoms of the same element (O2) or different elements (H2O).', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a solution?', 'A solid', 'A stable, uniform mixture of two or more miscible substances', 'A gas', 'A compound', 'b', 'A solution is a stable, uniform mixture of two or more miscible substances. It appears transparent, with dissolved particles that won''t settle out.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a solute?', 'The dissolving substance', 'The substance that is dissolved', 'A solid only', 'A gas only', 'b', 'The solute is the substance that is dissolved in a solution. Example: salt in saltwater - salt is the solute, water is the solvent.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a solvent?', 'The dissolved substance', 'The substance that dissolves the solute', 'Always a solid', 'Always a gas', 'b', 'The solvent is the substance that dissolves the solute. It''s usually the larger amount in the solution. Example: water in saltwater.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an emulsion?', 'A solid', 'A mixture of two immiscible liquids', 'A gas', 'A pure substance', 'b', 'An emulsion is a mixture of two immiscible (unmixable) liquids, like oil and water, combined using an emulsifying agent. Many hair products are emulsions.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a surfactant?', 'A type of oil', 'A substance that allows oil and water to mix', 'A solid', 'A gas', 'b', 'A surfactant is a substance that allows oil and water to mix. It has a water-loving head and oil-loving tail, making it essential in shampoos and cleansers.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a suspension?', 'A stable solution', 'An unstable mixture with visible particles that settle', 'A gas', 'A pure substance', 'b', 'A suspension is an unstable mixture with visible particles that settle over time. It must be shaken before use. Examples include some tonics and lotions.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between oil-in-water and water-in-oil emulsion?', 'No difference', 'Oil-in-water is lighter; water-in-oil is heavier and more moisturizing', 'Temperature difference', 'Color difference', 'b', 'Oil-in-water emulsions (lighter, less greasy) have oil droplets in water. Water-in-oil emulsions (heavier, more moisturizing) have water droplets in oil.', 'hard', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does pH measure?', 'Temperature', 'The acidity or alkalinity of a substance', 'Weight', 'Color', 'b', 'pH measures the acidity or alkalinity of a substance. pH stands for ''potential hydrogen'' and measures hydrogen ion concentration.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the pH scale range?', '0 to 10', '0 to 14', '1 to 10', '7 to 14', 'b', 'The pH scale ranges from 0 to 14. 0 is most acidic, 14 is most alkaline, and 7 is neutral.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What pH is neutral?', '0', '7', '14', '10', 'b', 'pH 7 is neutral. Pure water has a pH of 7 - it''s neither acidic nor alkaline.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the natural pH of hair?', '7.0 (neutral)', '4.5 to 5.5 (slightly acidic)', '8.0 to 9.0 (alkaline)', '2.0 to 3.0 (very acidic)', 'b', 'Hair''s natural pH is 4.5 to 5.5, slightly acidic. This acidity helps keep the cuticle closed and hair healthy.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What do acids do to the hair cuticle?', 'Open it', 'Close it', 'Remove it', 'Change its color', 'b', 'Acids close the hair cuticle, making hair smooth and shiny. This is why acidic products (like vinegar rinses) improve hair appearance.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What do alkalis do to the hair cuticle?', 'Close it', 'Open it', 'Remove it', 'Strengthen it', 'b', 'Alkalis open the hair cuticle, allowing penetration for chemical services like coloring and perming. High alkalinity can damage hair.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is pH important in hair products?', 'It doesn''t matter', 'It affects how products interact with hair and the results achieved', 'Only for color', 'Only for smell', 'b', 'pH is crucial because it affects how products interact with hair. Wrong pH can damage hair, while proper pH maintains health and achieves desired results.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 7);

-- Chapter 8 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is electricity?', 'A type of chemical', 'A form of energy that produces light, heat, and magnetic changes', 'A type of liquid', 'A solid material', 'b', 'Electricity is a form of energy that produces light, heat, and magnetic changes. It''s essential for powering barbering tools and equipment.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two types of electric current?', 'Hot and cold', 'Direct current (DC) and alternating current (AC)', 'Fast and slow', 'High and low', 'b', 'The two types of electric current are Direct Current (DC - flows one way, like batteries) and Alternating Current (AC - changes direction, like wall outlets).', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is direct current (DC)?', 'Current that changes direction', 'Current that flows in only one direction', 'Current that doesn''t flow', 'Current that flows both ways', 'b', 'Direct Current (DC) flows in only one direction. Batteries produce DC power, which is why cordless clippers use rechargeable batteries.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is alternating current (AC)?', 'Current that flows one way', 'Current that changes direction rapidly', 'Current that doesn''t flow', 'Battery power', 'b', 'Alternating Current (AC) changes direction rapidly. This is the type of electricity that comes from wall outlets in homes and shops.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a conductor?', 'A material that blocks electricity', 'A material that allows electricity to flow through it', 'A type of battery', 'A type of light bulb', 'b', 'A conductor is a material that allows electricity to flow through it easily. Metals like copper and aluminum are good conductors.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an insulator?', 'A material that conducts electricity', 'A material that does not allow electricity to flow through it', 'A type of wire', 'A type of battery', 'b', 'An insulator is a material that does not allow electricity to flow through it. Rubber, plastic, and glass are common insulators used for safety.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an electric current?', 'The flow of water', 'The flow of electricity along a conductor', 'The flow of air', 'The flow of heat', 'b', 'An electric current is the flow of electricity along a conductor. It''s measured in amperes (amps) and powers electrical devices.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a complete electric circuit?', 'A broken wire', 'The path of negative and positive electric currents moving from the generating source through conductors and back', 'A battery only', 'A light switch', 'b', 'A complete circuit is the path electricity travels from the power source, through conductors and devices, and back to the source. Without a complete circuit, electricity cannot flow.', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if an electrical fire starts?', 'Throw water on it', 'Use a Class C fire extinguisher', 'Use any extinguisher', 'Ignore it', 'b', 'For electrical fires, use a Class C fire extinguisher (or ABC-rated). Never use water on electrical fires - water conducts electricity and can cause electrocution.', 'medium', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a GFCI (Ground Fault Circuit Interrupter)?', 'A type of light bulb', 'A safety device that shuts off electricity when a ground fault is detected', 'A type of wire', 'A battery charger', 'b', 'A GFCI is a safety device that shuts off electricity when it detects a ground fault (electricity flowing where it shouldn''t). Required near water sources in barbershops.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should electrical appliances never be used near water?', 'Water makes them work better', 'Water conducts electricity and can cause electrocution', 'Water damages the color', 'Water makes them heavier', 'b', 'Water conducts electricity. Using electrical appliances near water creates a serious risk of electrocution. This is why GFCI outlets are required in wet areas.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if someone is being electrocuted?', 'Grab them immediately', 'Turn off the power source first, then help', 'Throw water on them', 'Use a metal object to separate them', 'b', 'First, turn off the power source or unplug the device. Never touch someone being electrocuted while they''re still in contact with electricity - you could be electrocuted too.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is overloading a circuit?', 'Using too little electricity', 'Connecting too many devices to one circuit, causing overheating', 'Using the right amount of electricity', 'Turning off lights', 'b', 'Overloading occurs when too many devices draw power from one circuit, exceeding its capacity. This can cause overheating, fires, or tripped breakers.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why are three-prong plugs safer than two-prong plugs?', 'They look better', 'The third prong grounds the appliance for safety', 'They cost more', 'They use less electricity', 'b', 'Three-prong plugs include a ground wire that provides a safe path for electricity if a malfunction occurs. This prevents electric shock and equipment damage.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you check before using electrical equipment?', 'Only the color', 'Cords for fraying, plugs for damage, and proper grounding', 'Only the price', 'Only the brand name', 'b', 'Always check cords for fraying or damage, ensure plugs are not broken, and verify proper grounding before using electrical equipment. Damaged equipment can cause shocks or fires.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does voltage measure?', 'The speed of electricity', 'The pressure that pushes electric current through a conductor', 'The weight of electricity', 'The color of electricity', 'b', 'Voltage measures the electrical pressure that pushes current through a conductor. Higher voltage means more pressure and more potential power.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does amperage (amp) measure?', 'The pressure of electricity', 'The strength or amount of electric current', 'The speed of light', 'The temperature', 'b', 'Amperage (amps) measures the strength or amount of electric current flowing through a circuit. It''s like measuring how much water flows through a pipe.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does wattage measure?', 'The voltage only', 'The amount of energy used or work performed', 'The color of light', 'The size of a wire', 'b', 'Wattage measures the amount of energy used or work performed. It''s calculated by multiplying volts × amps. Higher wattage means more power consumption.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the standard voltage in US homes?', '12 volts', '110-120 volts', '240 volts', '500 volts', 'b', 'Standard US household voltage is 110-120 volts AC. Some large appliances like dryers use 220-240 volts.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a fuse?', 'A type of light', 'A safety device containing a metal that melts at high temperatures to break a circuit', 'A type of battery', 'A power cord', 'b', 'A fuse contains a metal strip that melts when too much current flows through, breaking the circuit to prevent overheating and fire. It must be replaced after blowing.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a circuit breaker?', 'A type of wire', 'A switch that automatically breaks an electric circuit when overloaded', 'A type of plug', 'A battery', 'b', 'A circuit breaker is a switch that automatically breaks (opens) a circuit when overloaded. Unlike fuses, breakers can be reset after tripping.', 'easy', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a transformer?', 'A type of robot', 'An apparatus that changes alternating current from one voltage to another', 'A type of battery', 'A light switch', 'b', 'A transformer changes AC voltage from one level to another. It can step voltage up or down. This is how wall chargers convert 120V to lower voltages for devices.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a rheostat?', 'A type of battery', 'An apparatus that changes current strength', 'A type of wire', 'A light bulb', 'b', 'A rheostat is an apparatus that changes current strength. It''s used to control the intensity of electrical devices, like dimming lights or adjusting clipper speed.', 'hard', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an ampere (amp)?', 'A unit of voltage', 'A unit of electric strength', 'A unit of resistance', 'A unit of light', 'b', 'An ampere (amp) is the unit of electric current strength. It measures how much electricity is flowing through a circuit.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an ohm?', 'A unit of voltage', 'A unit of electric resistance', 'A unit of current', 'A unit of power', 'b', 'An ohm is the unit of electrical resistance. It measures how much a material opposes the flow of electricity. Higher ohms = more resistance.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is Ohm''s Law?', 'A safety rule', 'The relationship between voltage, current, and resistance: V = I × R', 'A type of wire', 'A battery law', 'b', 'Ohm''s Law states that Voltage (V) = Current (I) × Resistance (R). It describes the relationship between these three electrical properties.', 'hard', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a generator?', 'A type of battery', 'A machine that converts mechanical energy to electrical energy', 'A type of light', 'A power cord', 'b', 'A generator converts mechanical energy (like spinning) into electrical energy. Power plants use large generators to produce electricity.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a battery?', 'A type of wire', 'A device that produces direct current through chemical reaction', 'A type of light bulb', 'A power outlet', 'b', 'A battery produces direct current through a chemical reaction. It stores chemical energy and converts it to electrical energy when needed.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is grounding?', 'Connecting to the ceiling', 'Completing an electrical circuit by connecting to the ground or earth', 'Using a battery', 'Turning off power', 'b', 'Grounding completes an electrical circuit by connecting to the earth. It provides a safe path for excess electricity to dissipate, preventing shocks and equipment damage.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an inverter?', 'A type of battery', 'A device that changes DC to AC', 'A type of wire', 'A light switch', 'b', 'An inverter changes Direct Current (DC) to Alternating Current (AC). This allows battery-powered devices to run AC equipment, like in cars or with solar power.', 'hard', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 8);

-- Chapter 9 Quiz Questions (35)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the largest organ of the human body?', 'Liver', 'Skin', 'Heart', 'Brain', 'b', 'The skin is the largest organ of the human body. It covers about 20 square feet in adults and serves as the body''s first line of defense.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two main layers of the skin?', 'Top and bottom', 'Epidermis and dermis', 'Inside and outside', 'Front and back', 'b', 'The two main layers of skin are the epidermis (outer, protective layer) and the dermis (inner, deeper layer containing blood vessels and nerves).', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the epidermis?', 'The inner layer of skin', 'The outermost layer of skin', 'A type of muscle', 'A bone', 'b', 'The epidermis is the outermost layer of skin. It''s made of dead, flattened cells that are constantly shedding and being replaced.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the dermis?', 'The outer layer of skin', 'The deeper layer of skin containing blood vessels and nerves', 'A type of hair', 'A nail', 'b', 'The dermis is the deeper layer of skin containing blood vessels, nerves, hair follicles, sweat glands, and oil glands. It provides nourishment and sensation.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the subcutaneous layer?', 'The outer skin layer', 'The layer beneath the dermis containing fat and connective tissue', 'A muscle layer', 'A bone layer', 'b', 'The subcutaneous layer (hypodermis) is beneath the dermis. It contains fat, connective tissue, and larger blood vessels. It insulates and cushions the body.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are melanocytes?', 'Muscle cells', 'Cells that produce melanin (skin pigment)', 'Blood cells', 'Nerve cells', 'b', 'Melanocytes are cells that produce melanin, the pigment that gives skin its color. More melanin means darker skin; less means lighter skin.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is keratin?', 'A type of vitamin', 'A fibrous protein that gives skin, hair, and nails their hardness', 'A type of fat', 'A mineral', 'b', 'Keratin is a fibrous protein that gives skin, hair, and nails their hardness and water-resistant properties. It''s the key structural material making up these tissues.', 'medium', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are sebaceous glands?', 'Sweat glands', 'Oil glands that secrete sebum', 'Hair follicles', 'Blood vessels', 'b', 'Sebaceous glands are oil glands that secrete sebum. Sebum lubricates the skin and hair, keeping them soft and preventing drying.', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are sudoriferous glands?', 'Oil glands', 'Sweat glands', 'Hair follicles', 'Nerve endings', 'b', 'Sudoriferous glands are sweat glands. They produce perspiration (sweat) to help regulate body temperature and eliminate waste.', 'medium', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are hair follicles?', 'Nail roots', 'Tube-like pockets in the dermis where hair grows', 'Sweat glands', 'Oil glands', 'b', 'Hair follicles are tube-like pockets in the dermis where hair grows. Each follicle contains a root and is connected to sebaceous glands.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is one main function of the skin?', 'Only decoration', 'Protection from bacteria and injury', 'Only breathing', 'Only eating', 'b', 'One main function of skin is protection. It acts as a barrier against bacteria, viruses, injury, and harmful substances.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How does skin help regulate body temperature?', 'It doesn''t', 'Through sweating and blood vessel dilation/constriction', 'Only by shivering', 'Only by eating', 'b', 'Skin regulates temperature through sweating (cools the body) and by dilating (expanding) or constricting (narrowing) blood vessels to release or conserve heat.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is sensation in relation to skin?', 'The ability to see', 'The ability to feel touch, heat, cold, and pain', 'The ability to hear', 'The ability to taste', 'b', 'Skin contains nerve endings that detect touch, pressure, heat, cold, and pain. This sensation helps us interact with and respond to our environment.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How does skin help with excretion?', 'It doesn''t', 'By releasing sweat and waste products', 'Only through breathing', 'Only through eating', 'b', 'Skin helps with excretion by releasing sweat, which contains small amounts of waste products like urea and salts. This helps the body eliminate toxins.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How does skin absorb substances?', 'It doesn''t absorb anything', 'Certain substances can penetrate the skin barrier', 'Only water', 'Only air', 'b', 'Skin can absorb certain substances like medications (patches), chemicals, and some skincare products. This is why topical medications work.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the acid mantle?', 'A type of makeup', 'The protective acidic film on skin''s surface', 'A bone structure', 'A muscle', 'b', 'The acid mantle is the protective acidic film on the skin''s surface (pH 4.5-5.5). It helps protect against bacteria and maintains skin health.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is collagen?', 'A type of fat', 'A protein that gives skin strength and elasticity', 'A vitamin', 'A mineral', 'b', 'Collagen is a protein in the dermis that gives skin strength, firmness, and elasticity. As we age, collagen production decreases, causing wrinkles.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is acne?', 'A type of hair', 'A skin disorder characterized by inflammation of sebaceous glands', 'A nail disease', 'A bone condition', 'b', 'Acne is a common skin disorder where hair follicles become clogged with oil and dead skin cells, causing pimples, blackheads, and inflammation.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a comedo?', 'A type of hair', 'A blackhead or whitehead - a hair follicle clogged with sebum and dead cells', 'A nail', 'A bone', 'b', 'A comedo is a clogged hair follicle (pore) filled with sebum and dead skin cells. An open comedo is a blackhead; a closed comedo is a whitehead.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is seborrheic dermatitis?', 'A bone disease', 'An inflammatory condition causing scaly, flaky skin, often on scalp', 'A nail infection', 'A hair color', 'b', 'Seborrheic dermatitis is an inflammatory skin condition causing scaly, flaky, itchy skin, commonly on the scalp (dandruff), face, and chest.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is contact dermatitis?', 'A broken bone', 'Inflammation caused by contact with an irritant or allergen', 'A hair loss condition', 'A nail fungus', 'b', 'Contact dermatitis is skin inflammation caused by contact with irritants (like chemicals) or allergens. It causes redness, itching, and sometimes blisters.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is eczema?', 'A type of hair', 'A chronic inflammatory skin condition causing dry, itchy patches', 'A nail disease', 'A bone condition', 'b', 'Eczema (atopic dermatitis) is a chronic condition causing dry, itchy, inflamed skin patches. It''s not contagious but can be uncomfortable.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is psoriasis?', 'A nail polish', 'A chronic autoimmune condition causing rapid skin cell buildup', 'A hair color', 'A bone disease', 'b', 'Psoriasis is a chronic autoimmune condition causing rapid skin cell buildup, forming thick, silvery scales and itchy, dry patches. It''s not contagious.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is rosacea?', 'A hair style', 'A chronic condition causing facial redness and visible blood vessels', 'A nail shape', 'A bone structure', 'b', 'Rosacea is a chronic skin condition causing facial redness, visible blood vessels, and sometimes small, red, pus-filled bumps, typically on the face.', 'medium', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is impetigo?', 'A type of makeup', 'A contagious bacterial skin infection causing sores and crusts', 'A hair treatment', 'A nail polish', 'b', 'Impetigo is a highly contagious bacterial skin infection causing red sores that rupture, ooze, and form honey-colored crusts. It requires medical treatment.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a furuncle?', 'A type of hair', 'A boil - a painful, pus-filled infection of a hair follicle', 'A nail', 'A bone', 'b', 'A furuncle (boil) is a painful, pus-filled infection of a hair follicle and surrounding tissue, usually caused by bacteria. It can be contagious.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a lesion?', 'A type of hair', 'A mark on the skin that may indicate an injury or disease', 'A nail polish', 'A bone', 'b', 'A lesion is any mark, wound, or abnormal tissue on the skin. Lesions can indicate injury, disease, or infection and vary in appearance.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a primary lesion?', 'A lesion that comes second', 'The initial lesion that appears on previously healthy skin', 'A nail lesion', 'A bone lesion', 'b', 'A primary lesion is the initial lesion that appears on previously healthy skin, like a macule, papule, or vesicle. It shows the first sign of disease.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a secondary lesion?', 'The first lesion', 'A lesion that evolves from a primary lesion or is caused by external factors', 'A nail', 'A bone', 'b', 'A secondary lesion evolves from a primary lesion (like a crust or scale) or is caused by external factors like scratching or infection.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a macule?', 'A raised bump', 'A flat, discolored spot on the skin', 'A deep wound', 'A type of hair', 'b', 'A macule is a flat, distinct, discolored area of skin less than 1 cm wide. Freckles and flat moles are examples of macules.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a papule?', 'A flat spot', 'A small, raised, solid bump on the skin', 'A deep hole', 'A type of nail', 'b', 'A papule is a small (less than 1 cm), raised, solid bump on the skin. Pimples and insect bites often start as papules.', 'medium', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a vesicle?', 'A solid bump', 'A small, fluid-filled blister', 'A flat spot', 'A type of hair', 'b', 'A vesicle is a small, fluid-filled blister on the skin. Chickenpox and poison ivy cause vesicles. They''re usually less than 1 cm.', 'medium', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a pustule?', 'A clear fluid blister', 'A raised bump filled with pus', 'A flat spot', 'A type of nail', 'b', 'A pustule is a raised bump filled with pus (white blood cells, bacteria, and debris). Acne pimples are common examples of pustules.', 'medium', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a fissure?', 'A raised bump', 'A crack in the skin that penetrates the dermis', 'A flat spot', 'A type of hair', 'b', 'A fissure is a crack in the skin that penetrates into the dermis. Chapped lips and heel cracks are common examples of fissures.', 'medium', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an ulcer?', 'A raised bump', 'An open sore or lesion that extends to the dermis', 'A flat spot', 'A type of nail', 'b', 'An ulcer is an open sore or lesion that extends into the dermis. Ulcers can be caused by infection, pressure, or poor circulation.', 'medium', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 9);

-- Chapter 10 Quiz Questions (35)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is hair primarily made of?', 'Calcium', 'Keratin protein', 'Iron', 'Fat', 'b', 'Hair is primarily made of keratin, a fibrous protein. Keratin gives hair its strength, flexibility, and resistance to wear.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three layers of the hair shaft?', 'Top, middle, bottom', 'Cuticle, cortex, medulla', 'Front, side, back', 'Red, white, blue', 'b', 'The three layers are: cuticle (outer protective layer), cortex (middle layer with pigment and strength), and medulla (innermost layer, sometimes absent).', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the cuticle?', 'The inner layer of hair', 'The outermost layer of hair made of overlapping scales', 'The middle layer', 'The hair root', 'b', 'The cuticle is the outermost layer of hair, made of overlapping scale-like cells. It protects the inner layers and controls moisture entering/leaving.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the cortex?', 'The outer layer', 'The middle layer containing pigment and providing strength', 'The innermost layer', 'The hair follicle', 'b', 'The cortex is the middle layer of hair containing melanin (pigment) and providing strength, elasticity, and texture. It makes up most of the hair''s weight.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the medulla?', 'The outer layer', 'The innermost layer of the hair shaft', 'The middle layer', 'The hair root', 'b', 'The medulla is the innermost layer of the hair shaft. It''s a soft, spongy core that''s sometimes absent in fine or light-colored hair.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What gives hair its color?', 'The cuticle', 'Melanin in the cortex', 'The medulla', 'Water', 'b', 'Melanin in the cortex gives hair its color. Eumelanin creates brown/black shades; pheomelanin creates red/yellow shades. Gray hair lacks melanin.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a hair follicle?', 'The visible part of hair', 'The tube-like pocket in the skin where hair grows', 'A hair product', 'A styling tool', 'b', 'A hair follicle is a tube-like pocket in the dermis where hair grows. It contains the hair root and is connected to sebaceous glands.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the hair root?', 'The visible end of hair', 'The part of hair below the skin surface', 'A hair product', 'A styling technique', 'b', 'The hair root is the part of hair below the skin surface, anchored in the follicle. This is where hair growth occurs.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the hair shaft?', 'The root of hair', 'The visible part of hair above the skin', 'A tool', 'A product', 'b', 'The hair shaft is the visible part of hair above the skin surface. It''s made of dead, keratinized cells that have pushed up from the root.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three phases of hair growth?', 'Morning, afternoon, night', 'Anagen, catagen, telogen', 'Red, yellow, blue', 'Fast, medium, slow', 'b', 'The three phases are: anagen (growth phase), catagen (transitional phase), and telogen (resting/shedding phase). Each hair is in a different phase.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the anagen phase?', 'The resting phase', 'The active growth phase of hair', 'The shedding phase', 'The dormant phase', 'b', 'The anagen phase is the active growth phase where cells divide rapidly in the hair root. This phase lasts 2-7 years and determines hair length.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the catagen phase?', 'The growth phase', 'The transitional phase between growth and resting', 'The resting phase', 'The permanent phase', 'b', 'The catagen phase is a short (2-3 week) transitional phase where hair growth stops and the follicle shrinks. It''s between anagen and telogen.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the telogen phase?', 'The growth phase', 'The resting phase when hair sheds', 'The transitional phase', 'The permanent phase', 'b', 'The telogen phase is the resting phase lasting 2-4 months. The hair eventually sheds, and a new hair begins growing from the follicle.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How much does hair grow per month on average?', '1/4 inch', '1/2 inch', '1 inch', '2 inches', 'b', 'Hair grows about 1/2 inch (1.25 cm) per month on average, or about 6 inches per year. Growth rate varies by individual and health.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What percentage of hair is typically in the anagen phase?', '10%', '50%', '85-90%', '100%', 'c', 'About 85-90% of hair is typically in the anagen (growth) phase at any given time. This is why most hair is growing, not shedding.', 'hard', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the average number of hairs on a human head?', '10,000', '100,000', '1,000,000', '500', 'b', 'The average human head has about 100,000 hair follicles. Blondes tend to have more (150,000), redheads fewer (90,000).', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How many hairs does a person normally lose per day?', '0-10', '50-100', '500-1000', '5000', 'b', 'It''s normal to lose 50-100 hairs per day as part of the natural hair growth cycle. Excessive shedding may indicate a problem.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is hair texture?', 'The color of hair', 'The thickness or diameter of individual hair strands', 'The length of hair', 'The style of hair', 'b', 'Hair texture refers to the thickness or diameter of individual hair strands: fine (thin), medium, or coarse (thick). It''s determined by genetics.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is hair density?', 'The color of hair', 'The number of hair strands per square inch', 'The length of hair', 'The style of hair', 'b', 'Hair density refers to how many hair strands are per square inch of scalp: low, medium, or high density. It''s different from texture.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is hair porosity?', 'The color of hair', 'The hair''s ability to absorb moisture', 'The length of hair', 'The style of hair', 'b', 'Porosity is the hair''s ability to absorb and retain moisture. High porosity absorbs quickly but loses moisture fast; low porosity resists absorption.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is hair elasticity?', 'The color of hair', 'The hair''s ability to stretch and return to original length', 'The weight of hair', 'The shine of hair', 'b', 'Elasticity is the hair''s ability to stretch when wet and return to its original length without breaking. Healthy hair has good elasticity.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does it mean if hair is oily?', 'It has too little sebum', 'It has excess sebum production', 'It lacks moisture', 'It is damaged', 'b', 'Oily hair has excess sebum (oil) production from the sebaceous glands. This can make hair look greasy and require more frequent washing.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does it mean if hair is dry?', 'It has too much oil', 'It lacks moisture or natural oils', 'It is too long', 'It is too thick', 'b', 'Dry hair lacks sufficient moisture or natural oils. It may appear dull, feel rough, be prone to breakage, and have split ends.', 'easy', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a split end?', 'A hair cut', 'When the hair shaft splits or frays at the end', 'A hair color', 'A hair style', 'b', 'A split end occurs when the hair shaft splits or frays at the end due to damage. The only cure is trimming; products only temporarily seal them.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is dandruff?', 'A hair color', 'Flakes of dead skin from the scalp', 'A hair style', 'A type of haircut', 'b', 'Dandruff is the flaking of dead skin cells from the scalp. It''s often caused by dry skin, seborrheic dermatitis, or fungal infection.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between dry and oily dandruff?', 'No difference', 'Dry is small white flakes; oily is yellowish, greasy scales', 'Dry is yellow; oily is white', 'Dry is large; oily is small', 'b', 'Dry dandruff appears as small, white, dry flakes. Oily dandruff appears as larger, yellowish, greasy scales that may stick to the scalp.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is alopecia?', 'Hair growth', 'Hair loss or baldness', 'Hair coloring', 'Hair styling', 'b', 'Alopecia is the medical term for hair loss or baldness. It can be caused by genetics, hormones, medical conditions, medications, or stress.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is androgenic alopecia?', 'Hair growth from stress', 'Pattern baldness caused by genetics and hormones', 'Temporary hair loss', 'Hair breakage', 'b', 'Androgenic alopecia is pattern baldness (male or female pattern hair loss) caused by genetics and hormones. It''s the most common type of hair loss.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is alopecia areata?', 'Complete baldness', 'An autoimmune disorder causing patchy hair loss', 'Hair breakage', 'Hair thinning', 'b', 'Alopecia areata is an autoimmune disorder where the immune system attacks hair follicles, causing patchy hair loss. It can affect any hair-bearing area.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is telogen effluvium?', 'Permanent hair loss', 'Temporary hair shedding due to stress or shock', 'Hair growth', 'Hair coloring', 'b', 'Telogen effluvium is temporary excessive hair shedding caused by stress, illness, surgery, or hormonal changes. Hair usually regrows within months.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is trichotillomania?', 'A hair product', 'A psychological disorder involving compulsive hair pulling', 'A hair color technique', 'A scalp condition', 'b', 'Trichotillomania is a psychological disorder where a person compulsively pulls out their own hair, leading to noticeable hair loss and distress.', 'medium', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is tinea capitis?', 'A hair style', 'A fungal infection of the scalp (ringworm)', 'A hair color', 'A type of shampoo', 'b', 'Tinea capitis is a contagious fungal infection of the scalp (ringworm). It causes scaly patches, hair breakage, and sometimes bald spots. Requires medical treatment.', 'medium', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is pediculosis capitis?', 'A hair condition', 'Head lice infestation', 'A scalp fungus', 'A hair product', 'b', 'Pediculosis capitis is head lice infestation. Lice are parasitic insects that live on the scalp and feed on blood. Highly contagious but treatable.', 'medium', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is seborrheic dermatitis on the scalp?', 'Hair loss', 'An inflammatory condition causing scaly, flaky scalp', 'Hair growth', 'A hair color', 'b', 'Seborrheic dermatitis on the scalp causes scaly, flaky, itchy skin (severe dandruff). It''s related to oil production and yeast that lives on skin.', 'medium', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should a barber do if they suspect a contagious scalp condition?', 'Treat it themselves', 'Refer to a medical professional and avoid service', 'Ignore it', 'Use stronger products', 'b', 'Barbers should refer clients with suspected contagious conditions to medical professionals and avoid service until cleared. This protects everyone and follows regulations.', 'easy', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 10);

-- Chapter 11 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of a scalp treatment?', 'Only to color hair', 'To improve the condition of the scalp and promote healthy hair growth', 'Only to cut hair', 'Only to style hair', 'b', 'Scalp treatments improve scalp condition, remove buildup, stimulate circulation, and create a healthy environment for hair growth.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is scalp manipulation?', 'A haircut', 'Massaging the scalp to stimulate blood circulation', 'A hair color technique', 'A styling method', 'b', 'Scalp manipulation involves massaging the scalp to stimulate blood circulation, relax muscles, and distribute natural oils.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is scalp stimulation beneficial?', 'It has no benefits', 'It increases blood flow to hair follicles', 'It changes hair color', 'It makes hair shorter', 'b', 'Scalp stimulation increases blood flow to hair follicles, bringing nutrients and oxygen that promote healthy hair growth.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a scalp conditioner?', 'A haircut', 'A product applied to improve scalp condition', 'A styling tool', 'A type of shampoo', 'b', 'A scalp conditioner is a product applied to improve scalp condition, moisturize dry scalp, or treat specific scalp issues.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When should scalp treatments be recommended?', 'Only for long hair', 'For dry scalp, dandruff, or before chemical services', 'Only for men', 'Only for women', 'b', 'Scalp treatments should be recommended for dry scalp, dandruff, excessive oiliness, or before chemical services to protect the scalp.', 'medium', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the benefit of brushing hair before a scalp treatment?', 'To cut hair', 'To remove tangles and distribute natural oils', 'To color hair', 'To straighten hair', 'b', 'Brushing before treatment removes tangles, distributes natural oils along the hair shaft, and stimulates the scalp.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a hair and scalp analysis?', 'A haircut', 'An examination to determine condition and appropriate treatment', 'A styling technique', 'A color service', 'b', 'Hair and scalp analysis involves examining the client''s hair and scalp to determine condition, texture, porosity, and appropriate treatments.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What tool can be used to examine the scalp closely?', 'Scissors', 'A magnifying lamp or scope', 'A comb', 'A brush', 'b', 'A magnifying lamp or scope allows close examination of the scalp to identify conditions, flakes, or abnormalities not visible to the naked eye.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a hair conditioner?', 'A shampoo', 'A product that improves hair texture and manageability', 'A hair color', 'A styling gel', 'b', 'Hair conditioner improves hair texture, adds moisture, reduces tangles, and increases manageability by smoothing the cuticle layer.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a deep conditioning treatment?', 'A quick rinse', 'An intensive treatment that penetrates the cortex', 'A haircut', 'A color service', 'b', 'Deep conditioning treatments penetrate the hair cortex to provide intensive moisture and repair. They''re left on longer than regular conditioners.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is protein treatment used for?', 'To color hair', 'To strengthen hair and repair damage', 'To cut hair', 'To curl hair', 'b', 'Protein treatments strengthen hair by depositing protein (keratin) to repair damage, rebuild structure, and prevent breakage.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a hot oil treatment?', 'A hair color', 'Warm oil applied to condition hair and scalp', 'A haircut', 'A styling product', 'b', 'Hot oil treatments use warm oil to deeply condition hair and scalp, adding moisture, shine, and improving manageability.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of a porosity treatment?', 'To change hair color', 'To equalize porosity before chemical services', 'To cut hair', 'To straighten hair', 'b', 'Porosity treatments equalize hair''s ability to absorb moisture and products, ensuring even results in chemical services like coloring.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When should a protein treatment be recommended?', 'For all clients', 'For damaged, over-processed, or weak hair', 'Only for oily hair', 'Only for short hair', 'b', 'Protein treatments are recommended for damaged, over-processed, or weak hair that needs structural rebuilding and strength.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between moisturizing and protein treatments?', 'No difference', 'Moisturizing adds hydration; protein adds strength', 'Both are the same', 'Protein adds moisture', 'b', 'Moisturizing treatments add hydration and softness to dry hair. Protein treatments add strength and structure to damaged hair. Hair needs both.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a reconstructive treatment?', 'A haircut', 'An intensive treatment to rebuild severely damaged hair', 'A styling service', 'A color correction', 'b', 'Reconstructive treatments are intensive treatments designed to rebuild severely damaged hair structure, often combining protein and moisture.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the main ingredient in most conditioners?', 'Alcohol', 'Moisturizers and emollients', 'Bleach', 'Ammonia', 'b', 'Most conditioners contain moisturizers and emollients that smooth the cuticle, add shine, and improve manageability.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What do humectants do in hair products?', 'Dry out hair', 'Attract moisture from the air to hair', 'Color hair', 'Straighten hair', 'b', 'Humectants attract moisture from the air into the hair. Examples include glycerin and honey. They''re beneficial in humid climates.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are emollients in hair products?', 'Drying agents', 'Ingredients that soften and smooth hair', 'Coloring agents', 'Bleaching agents', 'b', 'Emollients are ingredients that soften and smooth hair by lubricating the surface and sealing in moisture. Oils and silicones are common emollients.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of essential oils in hair treatments?', 'To bleach hair', 'To provide fragrance and therapeutic benefits', 'To straighten hair', 'To cut hair', 'b', 'Essential oils provide natural fragrance and therapeutic benefits like stimulating circulation, soothing irritation, or balancing oil production.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be considered when selecting hair products?', 'Only the price', 'Hair type, condition, and desired results', 'Only the smell', 'Only the color', 'b', 'When selecting products, consider hair type, texture, condition (dry, oily, damaged), scalp condition, and desired results for best outcomes.', 'easy', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does pH-balanced mean for hair products?', 'It has no pH', 'The pH matches hair and skin''s natural acidity (4.5-5.5)', 'It''s very alkaline', 'It''s very acidic', 'b', 'pH-balanced products match hair and skin''s natural acidity (4.5-5.5). This helps maintain the acid mantle and keeps cuticles smooth.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should product ingredients be read?', 'They''re not important', 'To identify beneficial ingredients and potential allergens', 'Only to check price', 'Only for color', 'b', 'Reading ingredients helps identify beneficial ingredients for specific needs and potential allergens or irritants for sensitive clients.', 'easy', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the first step in a hair treatment service?', 'Apply product immediately', 'Analyze hair and scalp condition', 'Cut the hair', 'Style the hair', 'b', 'The first step is always analyzing hair and scalp condition to determine the appropriate treatment and products needed.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Should treatments be applied to clean or dirty hair?', 'Dirty hair', 'Clean hair', 'Wet hair only', 'Dry hair only', 'b', 'Treatments should be applied to clean hair so products can penetrate effectively without being blocked by dirt, oil, or product buildup.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of a processing cap or warm towel during treatments?', 'Decoration', 'To trap heat and help product penetration', 'To dry hair', 'To color hair', 'b', 'Processing caps or warm towels trap body heat, which opens the cuticle and helps treatment products penetrate deeper into the hair.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How long should deep conditioners typically process?', '30 seconds', '10-20 minutes depending on product', '2 hours', 'All day', 'b', 'Deep conditioners typically process for 10-20 minutes depending on the product instructions and hair condition. Always follow manufacturer guidelines.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What temperature water should be used to rinse treatments?', 'Hot water', 'Cool to lukewarm water', 'Boiling water', 'Ice water', 'b', 'Cool to lukewarm water is best for rinsing treatments. Hot water can strip moisture; very cold water may not remove all product.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done after a scalp treatment?', 'Nothing', 'Style as desired and recommend home care', 'Immediately color hair', 'Cut all the hair', 'b', 'After treatment, style as desired and recommend appropriate home care products to maintain results between salon visits.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is a patch test important before chemical treatments?', 'It''s not important', 'To check for allergic reactions', 'To check hair length', 'To check hair color', 'b', 'Patch tests check for allergic reactions to chemicals. They''re essential for client safety and often required by law before chemical services.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 11);

-- Chapter 12 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is one benefit of facial massage?', 'It removes hair', 'It increases blood circulation to the face', 'It changes face shape', 'It removes skin', 'b', 'Facial massage increases blood circulation, bringing oxygen and nutrients to skin cells. This promotes healthy, glowing skin and relaxation.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How does massage affect the muscles?', 'It weakens them', 'It relaxes and tones them', 'It removes them', 'It has no effect', 'b', 'Massage relaxes tense muscles and tones relaxed muscles. It helps maintain muscle tone and can relieve tension headaches and jaw pain.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What effect does massage have on the nervous system?', 'It stimulates only', 'It can be relaxing or stimulating depending on technique', 'It has no effect', 'It damages nerves', 'b', 'Massage can be either relaxing (slow, rhythmic movements) or stimulating (quick, brisk movements) depending on the technique and pressure used.', 'medium', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How does massage help with skin gland activity?', 'It stops gland activity', 'It stimulates glandular activity and oil production', 'It removes glands', 'It has no effect', 'b', 'Massage stimulates glandular activity, including oil (sebaceous) and sweat glands. This helps lubricate skin and eliminate waste.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is one psychological benefit of massage?', 'It causes stress', 'It promotes relaxation and reduces stress', 'It increases anxiety', 'It has no psychological effect', 'b', 'Massage promotes relaxation, reduces stress and anxiety, and creates a sense of well-being through touch and improved circulation.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How does massage help product absorption?', 'It prevents absorption', 'It helps products penetrate deeper into the skin', 'It removes products', 'It has no effect', 'b', 'Massage helps products penetrate deeper into the skin by warming the tissue, increasing circulation, and manually working products into the skin.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the overall effect of regular facial massage?', 'It damages skin', 'It improves skin health and appearance', 'It causes wrinkles', 'It has no effect', 'b', 'Regular facial massage improves skin health and appearance by increasing circulation, promoting cell renewal, and maintaining muscle tone.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is effleurage?', 'A deep pressure stroke', 'A light, continuous stroking movement', 'A tapping movement', 'A shaking movement', 'b', 'Effleurage is a light, continuous stroking movement used to spread product, relax the client, and begin/end massage sequences.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is petrissage?', 'Light stroking', 'A kneading movement that stimulates and increases circulation', 'Tapping', 'Vibration', 'b', 'Petrissage is a kneading movement that lifts, squeezes, and releases tissue. It stimulates circulation and helps relax muscles.', 'medium', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is tapotement?', 'Stroking', 'Kneading', 'Fast, tapping, striking movements', 'Circular movements', 'c', 'Tapotement involves fast, tapping, striking movements like tapping, cupping, or hacking. It''s stimulating and invigorating.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is friction in massage?', 'A type of oil', 'Deep rubbing movement that creates heat', 'Light stroking', 'Tapping', 'b', 'Friction involves deep rubbing movements that create heat. It''s used on small areas to break down adhesions and increase local circulation.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is vibration in massage?', 'A type of cream', 'A rapid shaking or trembling movement', 'A stroking movement', 'A kneading movement', 'b', 'Vibration is a rapid shaking or trembling movement applied with fingertips or hands. It''s stimulating and can help relieve muscle tension.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which massage movement is most relaxing?', 'Tapotement', 'Effleurage', 'Friction', 'Vibration', 'b', 'Effleurage (light, continuous stroking) is the most relaxing movement. It''s slow, rhythmic, and soothing to the nervous system.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Which massage movement is most stimulating?', 'Effleurage', 'Tapotement', 'Petrissage', 'All are equally stimulating', 'b', 'Tapotement (tapping, striking) is the most stimulating movement. It invigorates the skin and muscles and increases circulation rapidly.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What direction should facial massage movements generally follow?', 'Downward only', 'Upward and outward', 'Circular only', 'Random directions', 'b', 'Facial massage movements generally follow upward and outward directions to lift facial muscles and tissues, not pull them down.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What muscle is responsible for facial expressions?', 'Biceps', 'Muscles of expression (mimetic muscles)', 'Quadriceps', 'Heart muscle', 'b', 'The muscles of expression (mimetic muscles) are responsible for facial expressions. They''re unique because they insert into skin rather than bone.', 'easy', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the frontalis muscle?', 'A leg muscle', 'The muscle of the forehead that raises eyebrows', 'A back muscle', 'A stomach muscle', 'b', 'The frontalis is the muscle of the forehead. It raises the eyebrows, wrinkles the forehead, and creates horizontal forehead lines.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the orbicularis oculi?', 'A leg muscle', 'The circular muscle around the eye that closes the eyelid', 'A back muscle', 'A foot muscle', 'b', 'The orbicularis oculi is the circular muscle around the eye. It closes the eyelid and is responsible for blinking and squinting.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the orbicularis oris?', 'An eye muscle', 'The circular muscle around the mouth', 'A leg muscle', 'A back muscle', 'b', 'The orbicularis oris is the circular muscle around the mouth. It closes the lips, puckers them, and is essential for speech and eating.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the masseter muscle?', 'A forehead muscle', 'The chewing muscle at the jaw angle', 'An eye muscle', 'A neck muscle', 'b', 'The masseter is the powerful chewing muscle at the angle of the jaw. It closes the jaw and is one of the strongest muscles in the body relative to size.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the platysma muscles?', 'Face muscles', 'Broad muscles extending from chest to jaw', 'Arm muscles', 'Leg muscles', 'b', 'The platysma muscles are broad, thin muscles extending from the chest to the jaw. They pull down the corners of the mouth and tense neck skin.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are motor points?', 'Points on a car', 'Points on the face where nerves stimulate muscles', 'Points on a map', 'Points on a test', 'b', 'Motor points are specific points on the face where motor nerves stimulate muscles. They''re important reference points for facial massage and treatments.', 'hard', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done before beginning a facial massage?', 'Start immediately', 'Analyze skin and ensure hands are clean', 'Apply heavy makeup', 'Use hot water only', 'b', 'Before massage, analyze the skin condition and ensure hands are thoroughly clean and warm. This ensures safety and appropriate treatment.', 'easy', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be applied to the face before massage?', 'Nothing', 'A massage cream or oil appropriate for skin type', 'Water only', 'Soap', 'b', 'A massage cream or oil appropriate for the client''s skin type should be applied. This provides slip, nourishes skin, and prevents pulling.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should the client be positioned for facial massage?', 'Standing up', 'Reclining comfortably with neck supported', 'Lying flat on stomach', 'Sitting upright', 'b', 'The client should recline comfortably with the neck supported. This position allows complete relaxation and proper access to all facial areas.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the standard duration for a facial massage?', '1-2 minutes', '10-15 minutes depending on service', '1 hour', '30 seconds', 'b', 'Facial massage typically lasts 10-15 minutes depending on the service. Too short is ineffective; too long can over-stimulate or irritate skin.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done after completing a facial massage?', 'Leave product on', 'Remove excess product and apply appropriate finishing products', 'Apply more pressure', 'Use hot water', 'b', 'After massage, remove excess product with warm towels and apply appropriate finishing products like toner, moisturizer, or aftershave.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When should facial massage be avoided?', 'For all clients', 'For certain skin conditions like severe acne or inflammation', 'Only for men', 'Only for women', 'b', 'Facial massage should be avoided or modified for certain conditions like severe acne, skin infections, inflammation, or recent facial surgery.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a contraindication for facial massage?', 'Normal skin', 'Open wounds, severe acne, or skin infections', 'Dry skin', 'Oily skin', 'b', 'Contraindications include open wounds, severe acne, skin infections, contagious conditions, sunburn, or inflamed skin. Massage could worsen these conditions.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the importance of proper draping during facial services?', 'It''s not important', 'To protect client''s clothing and maintain professionalism', 'To keep the room warm', 'To hide products', 'b', 'Proper draping protects the client''s clothing from products, maintains professionalism and modesty, and enhances the service experience.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 12);

-- Chapter 13 Quiz Questions (35)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a straight razor?', 'An electric razor', 'A razor with a single blade that folds into handle', 'A safety razor', 'A clipper', 'b', 'A straight razor (cut-throat razor) has a single blade that folds into its handle. It requires skill and proper maintenance including stropping and honing.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a safety razor?', 'A straight razor', 'A razor with a guard to protect skin from blade', 'An electric shaver', 'A trimmer', 'b', 'A safety razor has a guard that protects skin from the blade edge. It uses replaceable blades and is safer than a straight razor for beginners.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is stropping?', 'Shaving', 'Polishing and sharpening a straight razor on a leather strap', 'Cleaning', 'Oiling', 'b', 'Stropping is polishing and sharpening a straight razor on a leather strap (strop). It''s done before each shave to maintain a sharp edge.', 'medium', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is honing?', 'Shaving', 'Grinding a razor blade on a stone to sharpen it', 'Cleaning', 'Stropping', 'b', 'Honing is grinding a razor blade on a special stone (hone) to sharpen it. It''s done less frequently than stropping when the blade becomes dull.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of a shaving brush?', 'To cut hair', 'To apply lather and lift beard hairs', 'To trim beard', 'To oil the skin', 'b', 'A shaving brush applies lather evenly, lifts beard hairs for easier cutting, exfoliates skin, and helps create a rich, warm lather.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What type of bristles are best for shaving brushes?', 'Plastic', 'Badger or boar hair (natural)', 'Metal', 'Rubber', 'b', 'Natural bristles (badger or boar hair) are best. They hold water, create rich lather, and feel soft on skin. Badger is considered premium quality.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a razor strop made of?', 'Metal', 'Leather', 'Plastic', 'Wood', 'b', 'A razor strop is typically made of leather (cowhide or horsehide). Some have a canvas back for initial cleaning before the leather finish.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the blade exposure on a razor?', 'The blade color', 'The amount of blade edge visible beyond the guard', 'The blade length', 'The blade width', 'b', 'Blade exposure is the amount of blade edge visible beyond the guard. More exposure means a closer shave but higher risk of cuts.', 'hard', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is skin preparation important before shaving?', 'It''s not important', 'To soften hair and open pores for a closer, safer shave', 'To dry the skin', 'To cool the skin', 'b', 'Skin preparation softens beard hair, opens pores, and lubricates skin. This allows the razor to glide smoothly and reduces irritation and cuts.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does pre-shave oil do?', 'Dries the skin', 'Creates a protective layer and helps razor glide', 'Removes hair', 'Tightens skin', 'b', 'Pre-shave oil creates a protective layer between skin and razor, helps the razor glide smoothly, and provides extra lubrication for sensitive skin.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is shaving cream used for?', 'To dry hair', 'To lubricate and protect skin during shaving', 'To color hair', 'To remove hair permanently', 'b', 'Shaving cream lubricates and protects skin during shaving. It creates a cushion between blade and skin, reducing friction and irritation.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between shaving cream and shaving soap?', 'No difference', 'Cream is ready to use; soap requires lathering with brush', 'Soap is better', 'Cream is always worse', 'b', 'Shaving cream is ready to use from tube/bowl. Shaving soap requires lathering with a brush. Both provide lubrication; choice is personal preference.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should a hot towel be used before shaving?', 'To cool skin', 'To soften beard and open pores', 'To dry skin', 'To tighten skin', 'b', 'A hot towel softens beard hair, opens pores, relaxes skin, and prepares the face for a smoother, more comfortable shave.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How long should a hot towel be applied before shaving?', '5 seconds', '2-3 minutes', '30 minutes', '1 hour', 'b', 'A hot towel should be applied for 2-3 minutes. This is enough time to soften beard hair and open pores without cooling down.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What direction should beard hair be rubbed during preparation?', 'Against the grain', 'In the direction of growth', 'In circles', 'It doesn''t matter', 'b', 'During preparation, rub in the direction of growth to lift hairs and determine growth patterns. This helps plan the shaving direction.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done if a client has very sensitive skin?', 'Shave dry', 'Use extra lubrication and consider pre-shave oil', 'Use no products', 'Shave quickly', 'b', 'For sensitive skin, use extra lubrication, consider pre-shave oil, use a sharp blade, shave with the grain, and apply soothing aftershave.', 'easy', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does ''shaving with the grain'' mean?', 'Shaving against hair growth', 'Shaving in the direction of hair growth', 'Shaving sideways', 'Shaving randomly', 'b', 'Shaving with the grain means shaving in the direction of hair growth. This causes less irritation and fewer ingrown hairs than against the grain.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does ''shaving against the grain'' mean?', 'Shaving with hair growth', 'Shaving opposite to hair growth direction', 'Shaving sideways', 'Not shaving', 'b', 'Shaving against the grain means shaving opposite to hair growth direction. It gives a closer shave but can cause more irritation and ingrown hairs.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the first pass in a standard shave?', 'Against the grain', 'With the grain', 'Across the grain', 'Random', 'b', 'The first pass should always be with the grain. This removes most hair with minimal irritation. Additional passes can go across or against.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the correct razor angle for shaving?', '90 degrees', '30 degrees', 'About 30 degrees to the skin', '180 degrees', 'c', 'The correct razor angle is about 30 degrees to the skin. Too steep causes cuts; too flat drags and doesn''t cut effectively.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should razor pressure be applied?', 'Heavy pressure', 'Light, gentle pressure - let the blade do the work', 'No pressure', 'Maximum pressure', 'b', 'Use light, gentle pressure. Let the blade''s weight and sharpness do the work. Heavy pressure causes irritation, razor burn, and cuts.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done between razor strokes?', 'Continue immediately', 'Rinse the blade in warm water', 'Dry the blade', 'Change blades', 'b', 'Rinse the blade in warm water between strokes to remove hair, cream, and debris. This ensures a clean, effective cut with each stroke.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a freehand stroke in shaving?', 'A stroke with two hands', 'A stroke using only the wrist and fingers, not the arm', 'A stroke with machine help', 'A stroke with assistance', 'b', 'A freehand stroke uses wrist and finger movement without moving the entire arm. It provides better control and precision around contours.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is stretching the skin during shaving?', 'Pulling skin tight to create a flat surface for shaving', 'Relaxing skin', 'Ignoring skin', 'Massaging skin', 'a', 'Stretching skin means pulling it taut with the free hand to create a flat, smooth surface. This allows the razor to glide evenly and prevents cuts.', 'medium', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done after the final shaving pass?', 'Apply immediately more cream', 'Rinse with cool water and apply aftershave', 'Dry with hot towel', 'Shave again immediately', 'b', 'After the final pass, rinse with cool water to close pores, pat dry gently, and apply aftershave or moisturizer to soothe and protect skin.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is alum block used for?', 'Shaving cream', 'A natural antiseptic to stop bleeding from small nicks', 'A brush', 'A razor', 'b', 'An alum block is a natural mineral stone used as an antiseptic. It stops bleeding from small nicks, closes pores, and acts as an astringent.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done before designing facial hair?', 'Start cutting immediately', 'Consult with client about desired style and face shape', 'Use clippers only', 'Shave everything', 'b', 'Always consult with the client first. Discuss desired style, consider face shape, hair growth patterns, and maintenance preferences.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What face shape benefits from a beard that adds width to the chin?', 'Round face', 'Oval face', 'Long/rectangular face', 'Square face', 'c', 'A long/rectangular face benefits from a beard that adds width to the chin area. This helps balance the face and make it appear shorter.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What face shape should avoid wide, full beards?', 'Oval', 'Round', 'Square', 'Diamond', 'b', 'Round faces should avoid wide, full beards that add width. Instead, longer beards that add length and angles are more flattering.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a goatee?', 'Full beard', 'Facial hair on chin only, sometimes with mustache', 'Sideburns only', 'Mustache only', 'b', 'A goatee is facial hair on the chin only, sometimes connected to a mustache. It can be styled in various shapes and lengths.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are sideburns?', 'Chin hair', 'Facial hair in front of ears extending from hairline', 'Mustache', 'Neck beard', 'b', 'Sideburns are patches of facial hair in front of the ears, extending down from the hairline. They can be long, short, wide, or narrow.', 'easy', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a neckline in beard design?', 'The top of the beard', 'The bottom edge of the beard on the neck', 'The side of the beard', 'The mustache', 'b', 'The neckline is the bottom edge of the beard on the neck. A well-defined neckline (typically just above Adam''s apple) creates a clean, intentional look.', 'easy', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a cheek line in beard design?', 'The bottom edge', 'The upper edge of the beard on the cheeks', 'The sideburns', 'The mustache', 'b', 'The cheek line is the upper edge of the beard on the cheeks. It defines how high the beard extends on the face and creates shape.', 'easy', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What tool is best for outlining a beard?', 'Scissors only', 'Trimmers or straight razor for precision', 'Clippers with guard', 'Comb only', 'b', 'Trimmers or a straight razor provide the precision needed for outlining. They create clean, sharp lines for cheek lines and necklines.', 'medium', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should a beard be trimmed to maintain shape?', 'Never', 'Every 1-2 weeks depending on growth rate', 'Daily', 'Yearly', 'b', 'Beards should be trimmed every 1-2 weeks depending on growth rate and desired style. Regular maintenance keeps the shape intentional and neat.', 'easy', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 13);

-- Chapter 14 Quiz Questions (35)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the first step in a haircutting service?', 'Start cutting immediately', 'Perform a thorough client consultation', 'Wet the hair', 'Apply product', 'b', 'The first step is always a thorough consultation. Understanding the client''s desires, lifestyle, and hair characteristics ensures satisfaction.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be discussed during a consultation?', 'Only the price', 'Desired style, lifestyle, maintenance, and hair history', 'Only the weather', 'Only sports', 'b', 'During consultation, discuss desired style, lifestyle, maintenance willingness, hair history, previous chemical services, and any concerns.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is hair analysis important before cutting?', 'It''s not important', 'To determine texture, density, growth patterns, and condition', 'Only to check color', 'Only to check length', 'b', 'Hair analysis determines texture, density, growth patterns, and condition. This information guides tool selection and cutting technique.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are growth patterns?', 'Hair color', 'The direction hair grows from the scalp', 'Hair length', 'Hair products', 'b', 'Growth patterns are the direction hair grows from the scalp (cowlicks, whorls). They affect how hair falls and must be considered when cutting.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a cowlick?', 'A type of animal', 'A section of hair that stands up or grows in opposite direction', 'A haircut', 'A hair color', 'b', 'A cowlick is a section of hair that stands up or grows in a different direction than surrounding hair, often at the crown or hairline.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should previous chemical services be discussed?', 'It''s not relevant', 'They affect hair condition and may limit cutting options', 'Only for pricing', 'Only for scheduling', 'b', 'Previous chemical services (color, perms, relaxers) affect hair condition. Over-processed hair may need special handling or conditioning treatments.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is face shape analysis used for?', 'Nothing', 'To recommend flattering hairstyles', 'To determine price', 'To schedule appointments', 'b', 'Face shape analysis helps recommend hairstyles that flatter the client''s features and create balance. Different shapes suit different styles.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are shears used for?', 'Shaving', 'Cutting hair with precision', 'Clipping hair', 'Drying hair', 'b', 'Shears (scissors) are the primary tool for precision haircutting. Quality shears provide clean cuts and reduce hand fatigue.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between shears and clippers?', 'No difference', 'Shears cut with blades; clippers use a motor and blade', 'Shears are electric', 'Clippers are manual', 'b', 'Shears are manual cutting tools with two blades. Clippers are electric tools with a motor that moves blades rapidly to cut large amounts of hair quickly.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are clipper guards used for?', 'Protection', 'To control the length of hair being cut', 'To oil clippers', 'To clean clippers', 'b', 'Clipper guards (attachments) snap onto clippers to control how much hair is cut. Different numbers indicate different lengths.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a longer cutting technique?', 'Using a #0 guard', 'Using shears for precision and longer lengths', 'Using no guard', 'Using trimmers', 'b', 'Shears are used for longer cutting techniques and precision work. They allow for more control and customization than clippers.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are thinning shears used for?', 'To cut all hair', 'To remove bulk and blend without shortening length significantly', 'To shave', 'To color hair', 'b', 'Thinning shears have teeth that remove bulk and blend sections without significantly shortening hair length. They''re used for texturizing.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a razor used for in haircutting?', 'Only shaving', 'Creating soft, textured edges and removing bulk', 'Only trimming', 'Only outlining', 'b', 'A razor creates soft, textured edges and can remove bulk. It gives a different effect than shears, creating movement and softness.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a trimmer used for?', 'Full haircuts', 'Detail work, outlining, and edging', 'Long hair', 'Color application', 'b', 'Trimmers are smaller than clippers and designed for detail work, outlining, edging around ears and necklines, and creating clean lines.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should tools be properly maintained?', 'It''s not important', 'For clean cuts, longevity, and client safety', 'Only for appearance', 'Only for storage', 'b', 'Proper maintenance ensures clean cuts, tool longevity, and client safety. Sharp, clean tools prevent hair damage and skin irritation.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a blunt cut?', 'A textured cut', 'A straight, even cut where all hair ends are the same length', 'A layered cut', 'A tapered cut', 'b', 'A blunt cut has all hair ends cut to the same length in a straight line. It creates weight and solid perimeter lines.', 'easy', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are layers in a haircut?', 'All hair the same length', 'Hair cut at different lengths to create volume and movement', 'Only short hair', 'Only long hair', 'b', 'Layers are created by cutting hair at different lengths. This creates volume, movement, removes weight, and can add texture.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is tapering?', 'Cutting all hair the same length', 'Gradually decreasing hair length toward the neckline or sides', 'Adding volume', 'Coloring hair', 'b', 'Tapering gradually decreases hair length toward the neckline or sides. It creates a smooth transition and clean, natural-looking edges.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is fading?', 'Coloring hair', 'A gradual transition from very short to longer hair', 'Adding volume only', 'Texturizing', 'b', 'A fade is a gradual transition from very short (often skin) to longer hair. It requires precise clipper work and blending techniques.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is texturizing?', 'Coloring hair', 'Removing bulk and creating movement within the haircut', 'Adding length', 'Straightening hair', 'b', 'Texturizing removes bulk and creates movement within the haircut. It''s done with shears, thinning shears, or razors for different effects.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between cross-checking and checking?', 'No difference', 'Checking verifies; cross-checking checks from opposite direction', 'Only checking matters', 'Only cross-checking matters', 'b', 'Checking verifies the cut from the original direction. Cross-checking examines the cut from the opposite direction to ensure balance and evenness.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is overdirection in cutting?', 'Cutting straight', 'Combing hair away from its natural position before cutting', 'Not cutting at all', 'Cutting wet only', 'b', 'Overdirection means combing hair away from its natural position before cutting. This creates weight, length, or graduation in specific areas.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is elevation in haircutting?', 'Height of chair', 'The angle at which hair is held while cutting', 'Speed of cutting', 'Type of tool', 'b', 'Elevation is the angle at which hair is held while cutting. Different elevations create different effects: 0° for blunt, 90° for layers, etc.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a guideline in haircutting?', 'A rule book', 'A section of hair that determines length for other sections', 'A tool', 'A product', 'b', 'A guideline is a section of hair cut to desired length that serves as a reference for cutting other sections. It ensures consistency.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is sectioning in haircutting?', 'Cutting randomly', 'Dividing hair into manageable parts for systematic cutting', 'Cutting all at once', 'Only cutting top', 'b', 'Sectioning divides hair into manageable parts. It ensures systematic, organized cutting and helps maintain control and consistency.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is product knowledge important for barbers?', 'It''s not important', 'To recommend appropriate products for client''s hair and style', 'Only for sales', 'Only for display', 'b', 'Product knowledge allows barbers to recommend appropriate products for each client''s hair type, condition, and desired style. This adds value to service.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does pomade do?', 'Dries hair', 'Provides shine and hold for slicked styles', 'Removes color', 'Cleans hair', 'b', 'Pomade provides shine and hold for slicked, polished styles. Oil-based pomades give high shine; water-based are easier to wash out.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between pomade and wax?', 'No difference', 'Pomade adds shine; wax provides matte finish and texture', 'Pomade is weaker', 'Wax is only for women', 'b', 'Pomade typically adds shine and slick hold. Wax provides matte finish, texture, and pliable hold good for messy, textured styles.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is clay used for in styling?', 'Making pottery', 'Adding volume, texture, and matte finish', 'Coloring hair', 'Straightening hair', 'b', 'Styling clay adds volume, texture, and matte finish. It absorbs oil and works well for fine hair needing body and separation.', 'medium', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does gel provide?', 'No hold', 'Strong hold and often shine', 'Only moisture', 'Only color', 'b', 'Gel provides strong hold and often shine. It dries hard and is good for styles needing maximum control and lasting power.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is mousse used for?', 'Cleaning', 'Adding volume and light hold to fine hair', 'Coloring', 'Straightening', 'b', 'Mousse adds volume, body, and light hold. It''s lightweight and works well for fine hair needing fullness without weight.', 'easy', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is sea salt spray used for?', 'Cooking', 'Creating beachy texture and matte finish', 'Coloring', 'Straightening', 'b', 'Sea salt spray creates beachy texture, waves, and matte finish. It mimics the effect of ocean water on hair for a natural, tousled look.', 'medium', 31
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is blow-drying used for?', 'Only drying hair', 'Drying, styling, and adding volume', 'Coloring', 'Cutting', 'b', 'Blow-drying dries hair while creating style and volume. Different techniques and brushes create different finishes and directions.', 'easy', 32
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is finger styling?', 'Using scissors', 'Using fingers to arrange and shape hair with product', 'Using a comb only', 'Using clippers', 'b', 'Finger styling uses fingers to arrange and shape hair, often with product. It creates natural, textured looks with movement and separation.', 'easy', 33
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be considered when recommending home care products?', 'Only price', 'Client''s hair type, lifestyle, and styling ability', 'Only brand', 'Only smell', 'b', 'Consider client''s hair type, lifestyle, maintenance willingness, and styling ability. Recommend products they''ll actually use effectively.', 'easy', 34
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 14);

-- Chapter 15 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three primary colors?', 'Red, orange, yellow', 'Red, yellow, blue', 'Red, white, blue', 'Black, white, gray', 'b', 'The three primary colors are red, yellow, and blue. These cannot be created by mixing other colors but can be combined to create all other colors.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the three secondary colors?', 'Red, yellow, blue', 'Orange, green, violet', 'Black, white, brown', 'Pink, peach, tan', 'b', 'The three secondary colors are orange (red+yellow), green (yellow+blue), and violet (blue+red). They''re created by mixing equal amounts of two primaries.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are tertiary colors?', 'Primary colors', 'Colors made by mixing a primary and secondary color', 'Black and white', 'Only natural colors', 'b', 'Tertiary colors are created by mixing a primary color with a secondary color adjacent to it on the color wheel, like red-orange or blue-green.', 'medium', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are complementary colors?', 'Colors that match', 'Colors opposite each other on the color wheel', 'Only warm colors', 'Only cool colors', 'b', 'Complementary colors are opposite each other on the color wheel (red-green, blue-orange, yellow-violet). They neutralize each other when mixed.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are warm colors?', 'Blue, green, violet', 'Red, orange, yellow', 'Black, white, gray', 'Brown, beige, tan', 'b', 'Warm colors are red, orange, and yellow. They appear to advance, are associated with fire/sun, and add warmth to hair color.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are cool colors?', 'Red, orange, yellow', 'Blue, green, violet', 'Black, white, gray', 'Brown, beige, tan', 'b', 'Cool colors are blue, green, and violet. They appear to recede, are associated with water/sky, and tone down warmth in hair color.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the law of color?', 'A legal rule', 'The principles governing how colors interact and mix', 'A hair product', 'A styling technique', 'b', 'The law of color refers to the principles governing how colors interact, mix, neutralize, and affect each other in haircoloring.', 'medium', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does ''tone'' mean in haircolor?', 'The lightness or darkness', 'The warmth, coolness, or neutrality of a color', 'The texture', 'The length', 'b', 'Tone refers to the warmth, coolness, or neutrality of a color. Warm tones (gold, copper, red) or cool tones (ash, beige, matte) describe the character of the color.', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between permanent and semi-permanent haircolor?', 'No difference', 'Permanent lifts and deposits; semi-permanent only deposits', 'Permanent is cheaper', 'Semi-permanent lasts longer', 'b', 'Permanent color lifts natural pigment and deposits new color into the cortex. Semi-permanent only deposits color on the cuticle and fades gradually.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is developer used for?', 'To add color only', 'To activate haircolor and lift natural pigment', 'To condition hair', 'To style hair', 'b', 'Developer (peroxide) activates haircolor molecules and lifts natural pigment. Different volumes (10, 20, 30, 40) provide different levels of lift.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does a higher volume developer do?', 'Deposits more color', 'Provides more lift but can be more damaging', 'Is gentler', 'Works faster only', 'b', 'Higher volume developers (30, 40) provide more lift but can be more damaging. Lower volumes (10, 20) deposit color with minimal lift.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a toner?', 'A permanent color', 'A demi-permanent color used to refine tone', 'A shampoo', 'A conditioner', 'b', 'A toner is a demi-permanent or semi-permanent color used after lightening to refine tone, neutralize unwanted warmth, or add shine.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is bleach used for?', 'To darken hair', 'To lighten hair by removing pigment', 'To condition hair', 'To add shine only', 'b', 'Bleach (lightener) removes natural and artificial pigment from hair to lighten it. It''s necessary for dramatic lightening or vibrant fashion colors.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a color filler?', 'A permanent color', 'A product used to replace missing pigment when going dark', 'A shampoo', 'A styling product', 'b', 'A color filler replaces missing underlying pigment when coloring lightened hair darker. Without it, results can be muddy or off-tone.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a glaze?', 'A permanent color', 'A transparent color that adds shine and tone', 'A bleach', 'A developer', 'b', 'A glaze is a transparent, demi-permanent color that adds shine, enhances tone, and refreshes color without dramatic change.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a strand test?', 'A strength test', 'Testing color on a small section before full application', 'A price test', 'A time test', 'b', 'A strand test applies color to a small section first to preview results, check processing time, and ensure desired color before full application.', 'easy', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a patch test?', 'A color test', 'Testing for allergic reactions 24-48 hours before service', 'A strength test', 'A price test', 'b', 'A patch test checks for allergic reactions by applying color behind the ear or inner elbow 24-48 hours before service. Required by law in many areas.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the virgin application technique?', 'Applying to damaged hair', 'Applying color to hair that has never been colored', 'Applying to gray hair only', 'Applying to ends only', 'b', 'Virgin application applies color to hair that has never been chemically treated. Color is typically applied to mid-lengths and ends first, then roots.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is retouch application?', 'Full head color', 'Coloring only the new growth at the roots', 'Coloring ends only', 'Removing color', 'b', 'Retouch (touch-up) application colors only the new growth at the roots. It''s done every 4-6 weeks to maintain consistent color from scalp to ends.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should color be applied to mid-lengths and ends last?', 'It''s faster', 'They are more porous and process faster', 'They''re less important', 'They''re harder to reach', 'b', 'Mid-lengths and ends are more porous and process color faster. Applying them last prevents over-processing and darker results than roots.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is balayage?', 'All-over color', 'A hand-painted highlighting technique', 'A permanent color', 'A root touch-up', 'b', 'Balayage is a hand-painted highlighting technique that creates natural, sun-kissed dimension. Color is painted freehand for a graduated effect.', 'easy', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is foiling?', 'Painting hair', 'Separating hair sections with foil for precise lightening', 'A shampoo technique', 'A cutting technique', 'b', 'Foiling involves weaving sections of hair and wrapping them in foil with lightener or color. It provides precise, controlled lightening and heat retention.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the processing time for most permanent haircolors?', '5 minutes', '30-45 minutes depending on desired result', '2 hours', 'All day', 'b', 'Most permanent haircolors process for 30-45 minutes depending on desired result, gray coverage needs, and manufacturer instructions.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is a thorough consultation important before coloring?', 'It''s not important', 'To understand client''s desires and hair history for safe, satisfactory results', 'Only for pricing', 'Only for scheduling', 'b', 'Consultation reveals client''s desires, hair history, previous chemical services, allergies, and lifestyle. This ensures safe, realistic, satisfactory results.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be discussed during a color consultation?', 'Only price', 'Desired color, maintenance, hair history, lifestyle', 'Only the weather', 'Only sports', 'b', 'During consultation, discuss desired color, maintenance commitment, hair history, previous chemical services, lifestyle, and realistic expectations.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is it important to know about previous chemical services?', 'It''s not important', 'They affect hair''s condition and how it will react to color', 'Only for pricing', 'Only for conversation', 'b', 'Previous chemical services affect hair condition and how it will react to new color. Over-processed hair may need special handling or conditioning first.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done if hair is over-processed?', 'Color immediately', 'Recommend conditioning treatments before coloring', 'Use stronger products', 'Ignore it', 'b', 'Over-processed hair needs conditioning treatments to restore health before coloring. Coloring damaged hair can cause breakage and poor results.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of petroleum jelly during color application?', 'To color hair', 'To protect skin from staining', 'To lighten hair', 'To condition hair', 'b', 'Petroleum jelly applied around the hairline and ears creates a barrier that prevents skin staining from haircolor during application.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should gloves be worn when applying haircolor?', 'They''re optional', 'To protect hands from chemicals and staining', 'Only for warmth', 'Only for style', 'b', 'Gloves protect hands from chemicals, prevent skin irritation, and avoid staining. They''re essential for safety and professional practice.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done if a client has an allergic reaction during coloring?', 'Continue coloring', 'Immediately rinse and seek medical attention if severe', 'Apply more color', 'Ignore it', 'b', 'If an allergic reaction occurs, immediately rinse color from hair and skin. Seek medical attention if symptoms are severe (difficulty breathing, swelling).', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 15);

-- Chapter 16 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a permanent wave (perm)?', 'A temporary curl', 'A chemical service that adds curl or wave to hair', 'A color service', 'A haircut', 'b', 'A permanent wave (perm) is a chemical service that adds curl or wave to straight hair by restructuring the hair''s internal bonds.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the two components of a perm?', 'Shampoo and conditioner', 'Permanent waving solution and neutralizer', 'Color and developer', 'Oil and water', 'b', 'A perm has two components: permanent waving solution (breaks bonds to reshape hair) and neutralizer (reforms bonds in new curl pattern).', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What do perm rods do?', 'Color hair', 'Determine the size and shape of the curl', 'Cut hair', 'Straighten hair', 'b', 'Perm rods determine the size and shape of the curl. Smaller rods create tighter curls; larger rods create looser waves.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the pH of acid perms?', 'Very high (alkaline)', 'Between 6.5-7.5 (acidic to neutral)', 'Very low', 'Neutral only', 'b', 'Acid perms have a pH between 6.5-7.5 (acidic to neutral). They''re gentler than alkaline perms and work more slowly.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the pH of alkaline perms?', 'Acidic', 'Between 8.0-9.5 (alkaline)', 'Neutral', 'Very low', 'b', 'Alkaline perms have a pH between 8.0-9.5. They process quickly and work well on resistant hair but can be more damaging.', 'medium', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an exothermic perm?', 'A cold perm', 'A perm that produces its own heat when mixed', 'A color service', 'A haircut', 'b', 'An exothermic perm produces its own heat when the waving solution and activator are mixed. The heat speeds up processing.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a spiral perm?', 'A straight perm', 'A perm using long rods to create spiral curls', 'A color service', 'A haircut', 'b', 'A spiral perm uses long rods placed vertically to create corkscrew or spiral curls. It works best on hair at least 8 inches long.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a partial perm?', 'A full head perm', 'A perm applied only to part of the hair', 'A temporary perm', 'A color service', 'b', 'A partial perm is applied only to part of the hair, such as just the ends or crown area, rather than the full head.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does the permanent waving solution do?', 'Sets the curl', 'Breaks disulfide bonds to allow reshaping', 'Conditions hair', 'Colors hair', 'b', 'Permanent waving solution breaks disulfide bonds in the cortex. This allows hair to be reshaped around the rod into a new curl pattern.', 'medium', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What does the neutralizer do?', 'Breaks bonds', 'Reforms disulfide bonds in the new curl shape', 'Cleans hair', 'Colors hair', 'b', 'Neutralizer (also called fixative) reforms the disulfide bonds in their new position around the rod, permanently setting the curl.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is a preliminary test curl important?', 'It''s not important', 'To check if hair is processing correctly before full application', 'Only for pricing', 'Only for scheduling', 'b', 'A preliminary test curl checks if hair is processing correctly and helps determine accurate processing time before completing full application.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the typical processing time for a perm?', '5 minutes', '10-30 minutes depending on hair and product', '2 hours', 'All day', 'b', 'Perm processing typically takes 10-30 minutes depending on hair type, condition, rod size, and product. Test curls determine exact timing.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What happens if a perm is under-processed?', 'Too curly', 'Weak or no curl formation', 'Damaged hair', 'Perfect results', 'b', 'Under-processed perms result in weak or no curl formation because bonds weren''t sufficiently broken to reshape the hair.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What happens if a perm is over-processed?', 'Better curls', 'Damaged, weak hair with possible breakage', 'No effect', 'Softer hair', 'b', 'Over-processing damages hair by breaking too many bonds. This causes weak, fragile hair that may break or have poor elasticity.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should hair be wrapped firmly but not tightly around perm rods?', 'Tighter is better', 'Too tight causes breakage and breakage lines', 'Loose is better', 'It doesn''t matter', 'b', 'Wrapping too tightly causes stress on hair, leading to breakage and breakage lines (indentations). Firm but not tight is ideal.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done if a client has had previous chemical services?', 'Proceed normally', 'Analyze hair carefully and possibly do strand test', 'Use stronger products', 'Refuse service', 'b', 'Previous chemical services must be analyzed. A strand test determines if hair can safely withstand perming and helps predict results.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a chemical hair relaxer?', 'A curling service', 'A chemical service that straightens curly or coily hair', 'A color service', 'A haircut', 'b', 'A chemical hair relaxer straightens curly or coily hair by breaking disulfide bonds and reforming them in a straight pattern.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the main ingredient in lye relaxers?', 'Ammonium thioglycolate', 'Sodium hydroxide', 'Peroxide', 'Ammonia', 'b', 'Lye relaxers contain sodium hydroxide (lye). They''re effective but can be harsh if not used properly. They work quickly.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the main ingredient in no-lye relaxers?', 'Sodium hydroxide', 'Guanidine hydroxide or calcium hydroxide', 'Peroxide', 'Ammonia', 'b', 'No-lye relaxers contain guanidine hydroxide or calcium hydroxide. They''re generally milder than lye relaxers but can be drying.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a base cream used for in relaxing?', 'To color hair', 'To protect scalp and skin from chemical burns', 'To curl hair', 'To condition hair', 'b', 'Base cream (petroleum jelly) is applied to scalp, hairline, and ears before relaxing to protect skin from chemical irritation and burns.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the processing time for most relaxers?', '1 hour', '10-20 minutes depending on hair texture and desired result', '5 seconds', 'All day', 'b', 'Relaxer processing typically takes 10-20 minutes depending on hair texture, desired straightness, and product. Timing is critical.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a retouch relaxer?', 'Full head relaxer', 'Relaxer applied only to new growth', 'A color service', 'A conditioning treatment', 'b', 'A retouch relaxer is applied only to new growth (regrowth) at the roots, typically every 6-12 weeks, not to previously relaxed hair.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why should relaxer never be applied to previously relaxed hair?', 'It''s fine to do so', 'It causes over-processing and breakage', 'It works better', 'It''s cheaper', 'b', 'Applying relaxer to previously relaxed hair causes over-processing, weakening, and breakage. Only new growth should be treated.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a predisposition test?', 'A color test', 'A test for allergic reactions or sensitivities', 'A strength test', 'A price test', 'b', 'A predisposition test (patch test) checks for allergic reactions or sensitivities to perm or relaxer chemicals before full application.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a strand test?', 'A color test', 'Testing chemical services on a small hair section first', 'A strength test', 'A price test', 'b', 'A strand test applies chemical service to a small section first to check processing time, results, and hair''s ability to withstand chemicals.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is elasticity testing important before chemical services?', 'It''s not important', 'To determine if hair is strong enough for chemicals', 'Only for pricing', 'Only for color', 'b', 'Elasticity testing determines if hair is strong enough for chemical services. Poor elasticity indicates damage and risk of breakage.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is porosity and why does it matter for perms?', 'It''s not important', 'How well hair absorbs chemicals; affects processing time', 'Only color-related', 'Only for styling', 'b', 'Porosity is how well hair absorbs chemicals. Highly porous hair processes faster and may need less time; resistant hair needs more time.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done if hair shows signs of breakage during processing?', 'Continue processing', 'Rinse immediately and condition', 'Apply more product', 'Ignore it', 'b', 'If breakage occurs during processing, rinse the chemical out immediately and apply conditioner. Do not continue with the service.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is it important to use gloves when applying perms or relaxers?', 'They''re optional', 'To protect hands from chemical irritation and burns', 'Only for warmth', 'Only for appearance', 'b', 'Gloves protect hands from chemical irritation, burns, and absorption. They''re essential safety equipment for chemical texture services.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the most important factor in successful chemical texture services?', 'Price', 'Proper analysis, product selection, and timing', 'Speed', 'Brand name', 'b', 'Success depends on proper hair analysis, selecting appropriate products, accurate timing, and following manufacturer instructions precisely.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 16);

-- Chapter 17 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of barber licensing?', 'To make money', 'To protect public health and safety', 'To limit competition', 'To create jobs', 'b', 'Barber licensing protects public health and safety by ensuring practitioners meet minimum competency standards in sanitation, safety, and technical skills.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Who regulates barbering in most states?', 'Federal government', 'State board of barbering/cosmetology', 'Local city government', 'Private companies', 'b', 'State boards of barbering or cosmetology regulate the profession. They set standards, issue licenses, inspect schools and shops, and enforce regulations.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is typically required to obtain a barber license?', 'Only paying a fee', 'Completing training hours, passing exams, and meeting age requirements', 'Knowing someone in the industry', 'Having a family member who is a barber', 'b', 'Licensing typically requires completing required training hours (varies by state), passing written and practical exams, and meeting minimum age/education requirements.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a practical examination?', 'A written test', 'A hands-on demonstration of skills', 'An oral interview', 'A background check', 'b', 'A practical examination is a hands-on test where candidates demonstrate barbering skills on mannequins or live models under examiner observation.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a written examination?', 'A hands-on test', 'A multiple-choice test of knowledge', 'An interview', 'A demonstration', 'b', 'A written examination tests knowledge through multiple-choice questions covering theory, sanitation, laws, and regulations.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is continuing education?', 'Initial training', 'Ongoing education required to maintain licensure', 'High school education', 'College degree', 'b', 'Continuing education is ongoing training required to maintain licensure in some states. It keeps barbers current on new techniques, products, and regulations.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is reciprocity?', 'A type of haircut', 'Recognition of a license from another state', 'A type of exam', 'A school program', 'b', 'Reciprocity is when one state recognizes a barber license from another state, often allowing licensure without repeating full training (may require additional testing).', 'medium', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the penalty for practicing without a license?', 'None', 'Fines, legal action, and possible criminal charges', 'A warning only', 'Community service', 'b', 'Practicing without a license can result in fines, legal action, cease and desist orders, and possible criminal charges depending on state laws.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What must be displayed in a barbershop?', 'Only prices', 'Barber licenses and shop license in visible location', 'Personal photos', 'Television', 'b', 'Barber licenses and the shop license must be displayed in a visible location where clients can see them. This is a legal requirement in most states.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a shop license?', 'A personal barber license', 'A separate license required to operate a barbershop', 'A driver''s license', 'A business card', 'b', 'A shop license is separate from individual barber licenses and is required to operate a barbershop. Shops must meet specific facility and sanitation standards.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are sanitation regulations designed to prevent?', 'Slow service', 'The spread of disease and infection', 'High prices', 'Competition', 'b', 'Sanitation regulations prevent the spread of disease and infection between clients. They protect both clients and barbers from communicable diseases.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the difference between sanitation and sterilization?', 'No difference', 'Sanitation reduces bacteria; sterilization kills all microorganisms', 'Sanitation is better', 'Sterilization is only for tools', 'b', 'Sanitation reduces bacteria to safe levels. Sterilization kills all microorganisms including bacterial spores. Different tools require different levels.', 'medium', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What must be done with tools that come into contact with blood?', 'Wiped with a towel', 'Disinfected with EPA-registered disinfectant or disposed of', 'Rinsed with water', 'Stored for later', 'b', 'Tools contacting blood must be disinfected with an EPA-registered disinfectant effective against HIV and Hepatitis B, or disposed of if single-use.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is Universal Precautions?', 'A haircut style', 'Treating all blood and body fluids as potentially infectious', 'A type of disinfectant', 'A licensing requirement only', 'b', 'Universal Precautions means treating all blood and certain body fluids as potentially infectious for bloodborne pathogens like HIV and Hepatitis B.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an MSDS/SDS?', 'A license', 'Material Safety Data Sheet/Safety Data Sheet with product safety information', 'A haircut', 'A tool', 'b', 'MSDS (Material Safety Data Sheet) or SDS (Safety Data Sheet) provides safety information about chemical products including hazards and first aid.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is professional liability insurance?', 'Car insurance', 'Insurance protecting against claims of negligence or harm to clients', 'Health insurance', 'Life insurance', 'b', 'Professional liability insurance (malpractice insurance) protects barbers against claims of negligence, injury, or harm caused to clients during services.', 'easy', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done if a client is injured in the shop?', 'Ignore it', 'Document the incident and provide first aid if trained', 'Blame the client', 'Continue working', 'b', 'Document the incident thoroughly, provide first aid if trained and permitted, and notify insurance and management as required by shop policy.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of a client record card?', 'Decoration', 'To document services, products used, and any reactions', 'To track payments only', 'To schedule appointments', 'b', 'Client record cards document services performed, products used, formulas, reactions, and client preferences. They''re important for consistency and liability.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the scope of practice?', 'A haircut', 'The services a licensed professional is legally allowed to perform', 'A tool', 'A type of product', 'b', 'Scope of practice defines what services a licensed professional is legally allowed to perform. Working outside scope can result in disciplinary action.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Can a barber perform services outside their scope of practice?', 'Yes, anytime', 'No, it violates regulations and can result in penalties', 'Only on friends', 'Only on family', 'b', 'Performing services outside scope of practice violates regulations and can result in license suspension, fines, or other penalties.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a temporary license or permit?', 'A permanent license', 'A limited license allowing practice while completing requirements', 'A fake license', 'An expired license', 'b', 'A temporary license or permit allows limited practice while completing requirements. It has restrictions and an expiration date.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is license renewal?', 'Getting a new license', 'Periodically updating license to maintain active status', 'Losing a license', 'Transferring a license', 'b', 'License renewal is the periodic process of updating a license to maintain active status. It usually requires fees and sometimes continuing education.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What happens if a license expires?', 'Nothing', 'Cannot legally practice until renewed; may require additional requirements', 'Automatic renewal', 'License becomes permanent', 'b', 'An expired license means you cannot legally practice. Renewal may require additional fees, testing, or retraining depending on how long it was expired.', 'easy', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a board inspection?', 'A haircut', 'Official visit to ensure compliance with regulations', 'A test', 'A meeting', 'b', 'Board inspections are official visits to shops and schools to ensure compliance with sanitation, safety, and licensing regulations.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be done to prepare for a board inspection?', 'Close the shop', 'Maintain daily compliance with all regulations', 'Hide tools', 'Send clients away', 'b', 'The best preparation is daily compliance with all regulations. Maintain cleanliness, proper disinfection, and organized records at all times.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is disciplinary action?', 'A reward', 'Consequences for violating board regulations', 'A promotion', 'A license renewal', 'b', 'Disciplinary action includes consequences for violating regulations: warnings, fines, probation, license suspension, or license revocation.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the best way to avoid disciplinary action?', 'Hide violations', 'Follow all regulations and maintain professional standards', 'Bribe officials', 'Change locations frequently', 'b', 'The best way to avoid disciplinary action is to follow all regulations, maintain professional standards, stay current on laws, and practice ethically.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is professional ethics?', 'A haircut', 'Moral principles guiding professional behavior', 'A type of tool', 'A licensing fee', 'b', 'Professional ethics are moral principles guiding behavior: honesty, integrity, confidentiality, respect for clients, and commitment to competence.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is client confidentiality important?', 'It''s not important', 'It''s legally and ethically required to protect client privacy', 'Only for famous clients', 'Only for medical information', 'b', 'Client confidentiality is legally and ethically required. Personal information, service details, and conversations should not be shared without permission.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should a barber do if they suspect a client has a contagious condition?', 'Tell everyone', 'Follow Universal Precautions and maintain confidentiality', 'Refuse all future service permanently', 'Post about it online', 'b', 'Follow Universal Precautions, use proper sanitation, maintain client confidentiality, and follow shop policies. Do not discriminate or breach confidentiality.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 17);

-- Chapter 18 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a resume?', 'A social media profile', 'A document summarizing work experience, education, and skills', 'A photo album', 'A text message', 'b', 'A resume is a formal document summarizing your work experience, education, skills, and qualifications for a job. It''s your marketing tool to employers.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should be included in a resume?', 'Only hobbies', 'Contact information, education, work experience, and skills', 'Personal problems', 'Favorite foods', 'b', 'A resume should include contact information, professional summary, education, work experience, relevant skills, and certifications/licenses.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How long should a resume typically be?', '5-10 pages', '1-2 pages', 'One paragraph', '20 pages', 'b', 'Resumes should typically be 1-2 pages. Be concise and relevant. Entry-level barbers should aim for one page; experienced professionals may use two.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a cover letter?', 'A text to a friend', 'A letter introducing yourself and explaining why you''re right for the job', 'A complaint letter', 'A thank you note after being hired', 'b', 'A cover letter introduces you to employers, explains why you''re interested in the position, and highlights why you''re a good fit for the job.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a portfolio in barbering?', 'A financial document', 'A collection of photos showing your best work', 'A type of haircut', 'A tool case', 'b', 'A barbering portfolio is a collection of photos showing your best haircuts, styles, and shaves. It visually demonstrates your skills to potential employers.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is networking?', 'Using the internet', 'Building professional relationships to advance your career', 'Making friends only', 'Playing sports', 'b', 'Networking is building professional relationships with people who can provide information, advice, referrals, and opportunities for career advancement.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is an informational interview?', 'A job interview', 'Meeting with a professional to learn about their career and industry', 'A disciplinary meeting', 'A sales pitch', 'b', 'An informational interview is meeting with a professional to learn about their career path, the industry, and their company. It''s for gathering information, not asking for a job.', 'medium', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a job board?', 'A wooden board', 'An online or physical listing of job openings', 'A cutting board', 'A chalkboard', 'b', 'A job board is an online platform (Indeed, LinkedIn) or physical location where employers post job openings and job seekers can apply.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you research before a job interview?', 'Nothing', 'The company, its services, culture, and the position', 'Only the salary', 'Only the location', 'b', 'Research the company''s services, culture, values, client base, and the specific position. This shows interest and helps you ask informed questions.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you wear to a barber job interview?', 'Casual clothes', 'Professional attire that reflects the shop''s style', 'Workout clothes', 'Pajamas', 'b', 'Dress professionally in a way that reflects the shop''s style. Look neat, clean, and well-groomed. Your appearance demonstrates your professionalism.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a practical interview in barbering?', 'A written test', 'Demonstrating skills on a model or mannequin', 'A phone call', 'A group discussion', 'b', 'A practical interview requires demonstrating your barbering skills on a model or mannequin. The employer evaluates your technique, speed, and finished result.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What questions should you ask in an interview?', 'Only about salary', 'About shop culture, expectations, growth opportunities, and clientele', 'No questions', 'Only about vacation', 'b', 'Ask about shop culture, performance expectations, growth opportunities, continuing education, clientele, and what success looks like in the role.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a follow-up after an interview?', 'Ignoring the employer', 'Sending a thank-you note or email within 24 hours', 'Calling every hour', 'Visiting unannounced', 'b', 'Send a thank-you note or email within 24 hours. Express appreciation for the opportunity, reiterate your interest, and briefly mention why you''re a good fit.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is commission-based pay?', 'Hourly wage', 'Earning a percentage of services performed', 'Salary only', 'Tips only', 'b', 'Commission-based pay means earning a percentage (often 40-60%) of the revenue from services you perform. Higher productivity means higher earnings.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is booth rental?', 'Renting a car', 'Renting space in a shop and working as an independent contractor', 'Renting equipment only', 'Renting a house', 'b', 'Booth rental means paying a weekly or monthly fee to rent space in a shop. You work as an independent contractor, set your own prices, and keep your earnings.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What are the advantages of being an employee vs. booth renter?', 'No difference', 'Employees get benefits/stability; booth renters have independence/higher earning potential', 'Employees earn more always', 'Booth renters have no expenses', 'b', 'Employees often receive benefits, paid time off, and stable income. Booth renters have independence, set their own schedule/prices, and have higher earning potential but more expenses.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a non-compete agreement?', 'A sports agreement', 'A contract restricting working for competitors within a certain area/time after leaving', 'A rental agreement', 'A partnership agreement', 'b', 'A non-compete agreement restricts you from working for competitors or opening a competing business within a certain geographic area and time period after leaving.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a 1099 form?', 'A job application', 'Tax form for independent contractors reporting income', 'A license', 'A resume', 'b', 'A 1099 form is a tax document used to report income earned as an independent contractor (booth renter). Taxes are not withheld; you pay them yourself.', 'medium', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a W-2 form?', 'A rental agreement', 'Tax form for employees showing wages and taxes withheld', 'A license application', 'A business plan', 'b', 'A W-2 form is a tax document employers provide to employees showing wages earned and taxes withheld throughout the year.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is continuing education important for?', 'It''s not important', 'Maintaining licensure, learning new techniques, and staying competitive', 'Only for new barbers', 'Only for shop owners', 'b', 'Continuing education maintains licensure (in some states), teaches new techniques and trends, and keeps you competitive in the industry.', 'easy', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a barber apprenticeship?', 'A college degree', 'Working under a licensed barber to gain experience and training', 'A vacation', 'A type of haircut', 'b', 'An apprenticeship involves working under a licensed barber to gain hands-on experience and training. Some states allow apprenticeship as a path to licensure.', 'easy', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is professional development?', 'Taking vacations', 'Activities that improve skills and advance your career', 'Social media posting', 'Shopping for tools', 'b', 'Professional development includes activities that improve your skills and advance your career: continuing education, advanced classes, networking, and building your brand.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is personal branding?', 'A logo tattoo', 'Marketing yourself and your unique skills and style', 'Wearing branded clothes', 'Using specific products', 'b', 'Personal branding is marketing yourself and your unique skills, style, and personality. It helps you stand out and attract your ideal clientele.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is social media''s role in a barber''s career?', 'Not important', 'Marketing, showcasing work, and building a client base', 'Only for entertainment', 'Only for personal use', 'b', 'Social media is a powerful marketing tool for showcasing your work, attracting new clients, building your brand, and connecting with other professionals.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if you don''t get a job you applied for?', 'Give up', 'Ask for feedback, continue improving, and keep applying', 'Complain online', 'Blame the employer', 'b', 'Ask for constructive feedback, use it to improve, continue building skills, and keep applying. Persistence and continuous improvement lead to success.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a probationary period?', 'A prison sentence', 'A trial employment period to evaluate fit and performance', 'A vacation period', 'A training course', 'b', 'A probationary period is a trial employment period (often 30-90 days) allowing both employer and employee to evaluate fit before permanent employment.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the best way to build a client base?', 'Waiting for walk-ins', 'Consistent quality work, excellent customer service, and marketing', 'Lowering prices drastically', 'Working fewer hours', 'b', 'Build a client base through consistent quality work, excellent customer service, asking for referrals, social media marketing, and community involvement.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a client retention rate?', 'The speed of service', 'The percentage of clients who return for repeat business', 'The number of new clients', 'The price of services', 'b', 'Client retention rate is the percentage of clients who return for repeat business. High retention indicates satisfaction and builds a stable income.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is punctuality important in barbering?', 'It''s not important', 'It shows professionalism and respects clients'' time', 'Only for the barber', 'Only for the shop owner', 'b', 'Punctuality shows professionalism, respects clients'' time, builds trust, and keeps the schedule running smoothly. Being late disrespects clients and costs money.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the most important factor in long-term career success?', 'Luck', 'Continuous learning, excellent service, and building relationships', 'Low prices', 'Working alone', 'b', 'Long-term success comes from continuous learning, providing excellent service, building strong client relationships, maintaining professionalism, and adapting to industry changes.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 18);

-- Chapter 19 Quiz Questions (30)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is inventory management?', 'Counting customers', 'Tracking and controlling stock of products and supplies', 'Hiring employees', 'Marketing services', 'b', 'Inventory management involves tracking and controlling stock levels of retail products, professional supplies, and tools to ensure availability while minimizing waste and costs.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a point-of-sale (POS) system?', 'A type of chair', 'Software for processing sales and tracking business data', 'A marketing strategy', 'A hiring tool', 'b', 'A POS system processes sales transactions, tracks inventory, manages appointments, and generates reports on revenue, popular services, and business performance.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the purpose of appointment scheduling?', 'To confuse clients', 'To organize time efficiently and minimize wait times', 'To raise prices', 'To hire staff', 'b', 'Appointment scheduling organizes barber time efficiently, minimizes client wait times, maximizes productivity, and creates a predictable workflow.', 'easy', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a cancellation policy?', 'A type of haircut', 'Rules regarding missed or cancelled appointments', 'A pricing strategy', 'A hiring policy', 'b', 'A cancellation policy establishes rules for missed or cancelled appointments, such as required notice time and any fees, to protect the barber''s income.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is retail sales in a barbershop?', 'Selling haircuts', 'Selling products for clients to use at home', 'Renting chairs', 'Hiring staff', 'b', 'Retail sales involve selling hair care, beard care, and styling products for clients to use at home. This provides additional revenue beyond services.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the benefit of selling retail products?', 'No benefit', 'Additional revenue and helping clients maintain their look', 'Higher prices only', 'Fewer customers', 'b', 'Retail sales provide additional revenue, help clients maintain their style between visits, demonstrate expertise, and increase client satisfaction and retention.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a business plan?', 'A haircut design', 'A document outlining business goals, strategies, and financial projections', 'A marketing flyer', 'A resume', 'b', 'A business plan is a comprehensive document outlining business goals, target market, services, pricing, marketing strategies, and financial projections.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is overhead?', 'Extra hair', 'Ongoing business expenses like rent, utilities, and supplies', 'Profit only', 'Employee wages only', 'b', 'Overhead refers to ongoing business expenses necessary to operate, including rent, utilities, insurance, supplies, and administrative costs.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is profit?', 'Total revenue', 'Revenue minus expenses', 'Total expenses', 'Number of customers', 'b', 'Profit is what remains after subtracting all business expenses (overhead, product costs, wages) from total revenue. It''s the actual earnings of the business.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a target market?', 'A dart game', 'The specific group of customers a business aims to serve', 'All people everywhere', 'Only friends and family', 'b', 'A target market is the specific group of customers a business aims to serve, defined by demographics, lifestyle, preferences, and needs.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is marketing?', 'Only advertising', 'Activities to promote services and attract clients', 'Only pricing', 'Only hiring', 'b', 'Marketing encompasses all activities to promote services, build brand awareness, attract new clients, and retain existing clients.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is social media marketing?', 'Talking to friends', 'Using social platforms to promote services and engage clients', 'Only for young people', 'Only for large businesses', 'b', 'Social media marketing uses platforms like Instagram and Facebook to showcase work, promote services, engage with clients, and attract new business.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is customer service?', 'Only cutting hair', 'All interactions that affect client satisfaction and experience', 'Only taking payments', 'Only scheduling', 'b', 'Customer service encompasses all interactions affecting client satisfaction: greeting, consultation, service quality, communication, and handling concerns.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is client retention?', 'Keeping hair', 'Keeping existing clients returning for repeat business', 'Finding new clients', 'Raising prices', 'b', 'Client retention is the ability to keep existing clients returning for repeat business. High retention is more cost-effective than constantly finding new clients.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a loyalty program?', 'A haircut style', 'Rewards for repeat clients to encourage retention', 'A hiring bonus', 'A pricing increase', 'b', 'A loyalty program rewards repeat clients with discounts, free services, or perks after a certain number of visits to encourage retention.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is upselling?', 'Overcharging', 'Suggesting additional services or products that benefit the client', 'Ignoring clients', 'Rushing services', 'b', 'Upselling involves suggesting additional services (beard trim, facial) or products that genuinely benefit the client and enhance their experience.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is cross-selling?', 'Angry clients', 'Recommending complementary products to go with services', 'Refusing service', 'Raising prices', 'b', 'Cross-selling recommends complementary products (pomade with haircut) that enhance the service and help clients maintain results at home.', 'medium', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a mission statement?', 'A religious document', 'A brief statement of business purpose and values', 'A financial report', 'A resume', 'b', 'A mission statement is a brief declaration of a business''s purpose, values, and goals. It guides decisions and communicates identity to clients and employees.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is branding?', 'Burning hair', 'Creating a unique identity and image for the business', 'Only the logo', 'Only the name', 'b', 'Branding creates a unique identity through name, logo, colors, atmosphere, service quality, and overall client experience. It differentiates from competitors.', 'easy', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a SWOT analysis?', 'A haircut technique', 'Analyzing Strengths, Weaknesses, Opportunities, and Threats', 'A financial report', 'A hiring tool', 'b', 'SWOT analysis evaluates internal Strengths and Weaknesses, and external Opportunities and Threats to develop strategic business plans.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is bookkeeping?', 'Reading books', 'Recording financial transactions and maintaining records', 'Cleaning the shop', 'Hiring employees', 'b', 'Bookkeeping involves recording all financial transactions (income, expenses, sales) and maintaining organized records for business management and taxes.', 'easy', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is accounts receivable?', 'Money owed to suppliers', 'Money clients owe the business', 'Cash on hand', 'Profit only', 'b', 'Accounts receivable is money owed to the business by clients for services or products provided but not yet paid for.', 'medium', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is accounts payable?', 'Money clients owe', 'Money the business owes to suppliers and vendors', 'Cash on hand', 'Revenue only', 'b', 'Accounts payable is money the business owes to suppliers, vendors, and creditors for products, supplies, or services received.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is cash flow?', 'Only profit', 'The movement of money in and out of the business', 'Only expenses', 'Only savings', 'b', 'Cash flow is the movement of money in and out of the business. Positive cash flow means more coming in than going out; negative means the opposite.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is break-even point?', 'A broken tool', 'When revenue equals expenses (no profit or loss)', 'Maximum profit', 'Minimum customers', 'b', 'Break-even point is when total revenue equals total expenses, resulting in neither profit nor loss. It''s the minimum needed to sustain the business.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is a profit and loss statement?', 'A haircut record', 'A financial report showing revenue, expenses, and profit/loss', 'An employee schedule', 'A client list', 'b', 'A profit and loss (P&L) statement is a financial report summarizing revenue, expenses, and profit or loss over a specific period.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is workers'' compensation insurance?', 'Health insurance', 'Insurance covering employees injured on the job', 'Car insurance', 'Life insurance', 'b', 'Workers'' compensation insurance provides medical benefits and wage replacement to employees injured on the job. It''s legally required in most states.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is liability insurance?', 'Car insurance', 'Insurance protecting against claims of injury or damage', 'Health insurance', 'Life insurance', 'b', 'Liability insurance protects the business against claims of bodily injury or property damage caused to clients or others.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the importance of cleanliness in a barbershop?', 'Only appearance', 'Client safety, professional image, and regulatory compliance', 'Only smell', 'Only comfort', 'b', 'Cleanliness ensures client safety, prevents infections, creates a professional image, meets regulatory requirements, and builds client trust.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is time management important for?', 'Only breaks', 'Maximizing productivity, reducing stress, and serving more clients', 'Only opening hours', 'Only closing hours', 'b', 'Time management maximizes productivity, reduces stress, allows serving more clients, ensures quality service, and maintains work-life balance.', 'easy', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 19);

-- Chapter 20 Quiz Questions (29)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Where does the word ''barber'' originate from?', 'Greek word for hair', 'Latin word ''barba'' meaning beard', 'French word for cut', 'English word for shop', 'b', 'The word ''barber'' comes from the Latin word ''barba'' meaning beard. Barbers have been caring for beards throughout history.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did barbering begin?', '20th century', 'Ancient times - as early as 3500 BC in Egypt', 'Middle Ages only', 'Renaissance only', 'b', 'Barbering dates back to ancient times. Egyptian tombs from around 3500 BC show barbers at work, and razors have been found from this period.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the barber''s pole originally used for?', 'Decoration only', 'Signifying bloodletting services', 'Holding towels', 'Supporting the roof', 'b', 'The barber''s pole originated from the practice of bloodletting. The red and white stripes represent bloody and clean bandages twisting in the wind as they dried on a pole.', 'medium', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What services did barbers provide in medieval times?', 'Only haircuts', 'Haircuts, shaving, bloodletting, and minor surgery', 'Only shaving', 'Only coloring', 'b', 'In medieval times, barbers were also surgeons and dentists. They performed bloodletting, tooth extraction, wound treatment, and other minor medical procedures.', 'easy', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What were barber-surgeons called in medieval Europe?', 'Doctors', 'Barber-surgeons', 'Hair stylists', 'Dentists only', 'b', 'Barber-surgeons were known as ''barber-surgeons'' and performed both grooming services and medical procedures. They were important figures in medieval communities.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did barbers and surgeons separate into different professions?', 'Ancient times', '1745 in England', '20th century', 'They never separated', 'b', 'In 1745, a bill was passed in England separating barbers from surgeons. The Company of Barbers and Surgeons split, with surgeons forming their own guild.', 'medium', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the first barber organization in America?', 'Modern Barbers Association', 'The Barber Company of Philadelphia (1758)', 'American Medical Association', 'There was none', 'b', 'The first barber organization in America was The Barber Company of Philadelphia, formed in 1758. It helped establish standards and professionalism.', 'hard', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did barbering become a licensed profession in the US?', '1700s', 'Late 1800s and early 1900s', '2000s', 'It was always licensed', 'b', 'Barber licensing began in the late 1800s and early 1900s as states recognized the need for standards in sanitation and professional practice.', 'medium', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the first state to require barber licensing?', 'California', 'Minnesota (1897)', 'New York', 'Texas', 'b', 'Minnesota was the first state to require barber licensing in 1897. This set the precedent for other states to follow.', 'hard', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the purpose of early barber licensing?', 'To make money', 'To protect public health through sanitation standards', 'To limit competition', 'To create unions', 'b', 'Early licensing aimed to protect public health by establishing sanitation standards, ensuring barbers understood hygiene and safe practices.', 'medium', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the tonsure?', 'A haircut style', 'A religious practice of shaving part or all of the head', 'A tool', 'A shop', 'b', 'Tonsure is the religious practice of shaving part or all of the head. It was practiced by monks and clergy, and barbers often performed this service.', 'medium', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What famous figure was known to cut his own hair?', 'King Henry VIII', 'Julius Caesar', 'Napoleon', 'George Washington', 'b', 'Julius Caesar was known to have his hair cut and beard shaved. Ancient Roman barbers were highly valued in society.', 'hard', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What did ancient Egyptian barbers use as razors?', 'Steel blades', 'Sharpened stone or bronze', 'Laser beams', 'Electric clippers', 'b', 'Ancient Egyptian barbers used sharpened stone or bronze razors. Archaeologists have found these tools in ancient tombs.', 'medium', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was a ''barber''s basin'' used for?', 'Hair coloring', 'Catching blood during bloodletting', 'Holding water', 'Storing tools', 'b', 'A barber''s basin was used to catch blood during bloodletting procedures. This medical service was a significant part of historical barbering.', 'medium', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did the safety razor become popular?', 'Ancient times', 'Early 1900s with King C. Gillette''s invention', '1980s', '2000s', 'b', 'The safety razor became popular in the early 1900s after King C. Gillette invented the disposable blade safety razor in 1901.', 'medium', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the ''weekend shave'' tradition?', 'Shaving on Saturdays', 'Men visiting barbers for a shave on weekends', 'Shaving only on Sundays', 'Not shaving on weekends', 'b', 'The weekend shave was a tradition where men visited barbershops on weekends for a professional shave and socializing. It was a weekly ritual.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What role did barbershops play in African American communities?', 'Only haircuts', 'Important social and economic centers', 'Medical services only', 'Political offices', 'b', 'Barbershops were crucial social and economic centers in African American communities, providing safe spaces for discussion, networking, and entrepreneurship.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the National Association of Barber Boards of America (NABBA)?', 'A haircut style', 'An organization that helps standardize barber licensing across states', 'A product company', 'A union', 'b', 'NABBA is an organization that helps standardize barber licensing and examinations across states, promoting consistency in the profession.', 'hard', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the ''barber''s chair'' innovation?', 'A type of haircut', 'The first adjustable hydraulic chair for client comfort', 'A waiting room chair', 'A styling tool', 'b', 'The barber''s chair was an innovation featuring hydraulic adjustments for height and recline, improving client comfort and barber access.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What did the straight razor symbolize historically?', 'Danger only', 'The barber''s skill and professionalism', 'Wealth only', 'Religion', 'b', 'The straight razor symbolized the barber''s skill and professionalism. Mastery of this tool demonstrated expertise and craftsmanship.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'When did electric clippers become common in barbershops?', '1800s', '1920s-1930s', '1990s', '2000s', 'b', 'Electric clippers became common in barbershops in the 1920s-1930s, revolutionizing the speed and efficiency of haircuts.', 'medium', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the ''barber''s apprentice'' system?', 'Going to college', 'Learning the trade by working under an experienced barber', 'Reading books only', 'Online courses', 'b', 'The apprentice system involved learning barbering by working under an experienced barber, observing and practicing skills over time.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What happened to barbering during the Great Depression?', 'It grew rapidly', 'Many shops closed but barbering remained essential', 'It became illegal', 'Only wealthy people used barbers', 'b', 'During the Great Depression, many shops struggled and closed, but barbering remained an essential service that people still needed.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the barber''s code of ethics?', 'A haircut style', 'Professional standards of conduct and integrity', 'A pricing list', 'A tool set', 'b', 'The barber''s code of ethics establishes professional standards of conduct, integrity, confidentiality, and respect for clients and colleagues.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What was the ''unisex'' movement''s effect on barbering?', 'No effect', 'Salons began serving men, creating competition for barbershops', 'Barbershops closed', 'Only women became barbers', 'b', 'The unisex movement of the 1960s-70s led to salons serving men, creating competition. Many barbershops adapted by offering more services.', 'medium', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the modern barbershop renaissance?', 'Closing shops', 'The resurgence of traditional barbershops emphasizing craft and experience', 'Only online services', 'Only women barbers', 'b', 'The modern barbershop renaissance (2010s-present) emphasizes traditional craftsmanship, premium experiences, and the social aspect of barbering.', 'easy', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the significance of the barber''s license?', 'Just a piece of paper', 'Legal authorization and proof of competency to practice', 'Only for taxes', 'Only for decoration', 'b', 'The barber''s license is legal authorization to practice and proof of competency. It protects the public and maintains professional standards.', 'easy', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What role did barbers play during wartime?', 'None', 'Cutting hair for soldiers and sometimes minor medical aid', 'Only officers', 'Only pilots', 'b', 'During wartime, barbers served military personnel by providing haircuts and shaves. Their skills were essential for maintaining grooming standards.', 'medium', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the future of barbering?', 'Disappearing', 'Continued growth with emphasis on skill, experience, and personal service', 'Fully automated', 'Only for celebrities', 'b', 'Barbering continues to grow with emphasis on skill, client experience, and personal service. The craft remains valued despite technological changes.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 20);

-- Chapter 21 Quiz Questions (31)
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the most important aspect of client consultation?', 'Speed', 'Listening to the client''s needs and expectations', 'Talking about yourself', 'Finishing quickly', 'b', 'Listening to the client''s needs, lifestyle, and expectations is the most important aspect of consultation. Understanding leads to satisfaction.', 'easy', 0
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if a client is unhappy with their service?', 'Ignore them', 'Listen, apologize, and offer to fix it professionally', 'Argue with them', 'Charge them extra', 'b', 'Listen to their concerns without defensiveness, apologize sincerely, and offer to make adjustments. Professional handling can turn dissatisfaction into loyalty.', 'easy', 1
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle a difficult client?', 'Refuse service', 'Remain professional, listen, and set clear boundaries', 'Be rude back', 'Ignore their requests', 'b', 'Remain professional, listen actively, set clear boundaries respectfully, and focus on finding solutions. Don''t take negativity personally.', 'medium', 2
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is professional distance?', 'Physical space only', 'Maintaining appropriate boundaries while being friendly', 'Being cold', 'Being best friends with clients', 'b', 'Professional distance means being warm and friendly while maintaining appropriate boundaries. You''re their barber, not their therapist or best friend.', 'medium', 3
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is punctuality important?', 'It''s not', 'It shows respect for clients'' time and professionalism', 'Only for the barber', 'Only for the owner', 'b', 'Punctuality demonstrates respect for clients'' time, professionalism, and reliability. Being late disrespects clients and can cost you business.', 'easy', 4
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if you''re running late?', 'Nothing', 'Contact the client as soon as possible', 'Rush the current client', 'Cancel the appointment', 'b', 'Contact the waiting client as soon as you know you''ll be late. Apologize, give an estimated time, and let them decide if they want to wait or reschedule.', 'easy', 5
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should you clean your station?', 'Once a week', 'Throughout the day and thoroughly after each client', 'Once a month', 'Never', 'b', 'Clean and disinfect your station throughout the day and thoroughly after each client. This maintains hygiene and professional appearance.', 'easy', 6
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the proper way to handle tools after use?', 'Put them away dirty', 'Clean, disinfect, and store properly', 'Leave them out', 'Throw them away', 'b', 'Clean, disinfect according to regulations, and store tools properly after each use. This prevents cross-contamination and maintains tool condition.', 'easy', 7
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is continuing education important throughout your career?', 'It''s not', 'To stay current with trends, techniques, and regulations', 'Only for beginners', 'Only for shop owners', 'b', 'Continuing education keeps you current with new techniques, trends, products, and regulations. It maintains your competitiveness and professionalism.', 'easy', 8
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you wear to work?', 'Whatever you want', 'Clean, professional attire appropriate for the shop', 'Pajamas', 'Workout clothes', 'b', 'Wear clean, professional attire that fits the shop''s style. Your appearance reflects your professionalism and the business''s image.', 'easy', 9
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle confidential client information?', 'Share it with others', 'Keep it private and secure', 'Post it online', 'Tell other clients', 'b', 'Keep all client information confidential. Don''t discuss one client''s business with others or share personal information without permission.', 'easy', 10
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the best way to build a loyal clientele?', 'Lowest prices', 'Consistent quality, great service, and genuine relationships', 'Fastest cuts', 'Most expensive services', 'b', 'Build loyalty through consistent quality work, excellent customer service, remembering preferences, and building genuine relationships over time.', 'easy', 11
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle tips?', 'Ignore them', 'Accept graciously and thank the client', 'Refuse them', 'Demand them', 'b', 'Accept tips graciously with a sincere thank you. Tips are appreciation for good service. Don''t discuss tips or expect them from clients.', 'easy', 12
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if you make a mistake?', 'Hide it', 'Acknowledge it, apologize, and fix it professionally', 'Blame the client', 'Ignore it', 'b', 'Acknowledge mistakes honestly, apologize sincerely, and do your best to fix them. Everyone makes mistakes; how you handle them shows professionalism.', 'easy', 13
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is it important to know your products?', 'It''s not', 'To make informed recommendations and answer client questions', 'Only for sales', 'Only for display', 'b', 'Knowing your products allows you to make informed recommendations, answer questions, and help clients maintain their look between visits.', 'easy', 14
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle a client with a contagious condition?', 'Refuse all future service', 'Follow Universal Precautions and maintain confidentiality', 'Announce it to others', 'Refuse to serve them', 'b', 'Follow Universal Precautions for all clients. Use proper sanitation, maintain confidentiality, and don''t discriminate. Treat all clients with dignity.', 'medium', 15
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the proper way to drape a client?', 'Any way works', 'Completely cover clothing with clean cape, snug at neck', 'Loosely cover', 'Only cover shoulders', 'b', 'Drape clients completely with a clean cape, securing it snugly at the neck to prevent hair from getting on clothing while ensuring comfort.', 'easy', 16
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How often should you sharpen or replace blades?', 'Once a year', 'When they become dull or show wear', 'Never', 'Daily', 'b', 'Sharpen or replace blades when they become dull or show wear. Sharp tools provide better results and prevent pulling and discomfort.', 'easy', 17
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the importance of ergonomics in barbering?', 'Not important', 'Preventing injury and ensuring career longevity', 'Only for appearance', 'Only for speed', 'b', 'Proper ergonomics (posture, positioning, tool use) prevents repetitive strain injuries and back problems, ensuring a long, healthy career.', 'medium', 18
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle a client who talks constantly?', 'Ignore them', 'Engage appropriately while maintaining focus on your work', 'Tell them to be quiet', 'Stop working', 'b', 'Engage in conversation appropriately while maintaining focus on your work. Some clients chat to relax; balance friendliness with professional attention to the service.', 'medium', 19
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What should you do if you don''t know how to do a requested style?', 'Pretend you do', 'Be honest and suggest alternatives or refer to someone experienced', 'Refuse to help', 'Make excuses', 'b', 'Be honest about your capabilities. Suggest alternatives, offer to research and practice, or refer them to a barber experienced in that style.', 'easy', 20
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is it important to take photos of your work?', 'For vanity', 'For your portfolio and to show clients potential styles', 'To post without permission', 'To criticize clients', 'b', 'Photos build your portfolio, showcase your skills, help with client consultations, and provide documentation of your growth. Always get permission before posting.', 'easy', 21
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle a no-show client?', 'Never book them again', 'Follow shop policy, contact them, and document the incident', 'Charge them without notice', 'Complain online', 'b', 'Follow your shop''s no-show policy. Contact the client to check in, document the incident, and enforce any stated penalties consistently.', 'medium', 22
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the proper way to sanitize a cape?', 'Shake it off', 'Wash regularly according to manufacturer instructions', 'Never wash', 'Spray with perfume', 'b', 'Wash capes regularly according to manufacturer instructions. Clean capes are essential for hygiene and professional appearance.', 'easy', 23
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How can you stay motivated in your career?', 'It''s not possible', 'Set goals, continue learning, and celebrate achievements', 'Comparing yourself negatively', 'Working less', 'b', 'Stay motivated by setting goals, continuing education, celebrating achievements, networking with peers, and remembering why you chose this craft.', 'easy', 24
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the importance of professional associations?', 'None', 'Networking, continuing education, and staying informed about industry changes', 'Only for fees', 'Only for socializing', 'b', 'Professional associations offer networking, continuing education, industry news, advocacy, and resources that help advance your career.', 'medium', 25
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle negative online reviews?', 'Ignore them', 'Respond professionally, apologize, and offer to make it right', 'Argue publicly', 'Delete them', 'b', 'Respond professionally and promptly. Apologize for their experience, offer to make it right, and take detailed conversations offline when appropriate.', 'medium', 26
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the key to work-life balance in barbering?', 'Working all the time', 'Setting boundaries, scheduling time off, and taking care of yourself', 'Never taking breaks', 'Working weekends only', 'b', 'Set boundaries, schedule regular time off, take care of your physical and mental health, and remember that rest makes you a better barber.', 'easy', 27
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'Why is it important to document client preferences?', 'It''s not', 'To provide consistent service and show you value them', 'To gossip', 'To charge more', 'b', 'Documenting preferences (cut details, products, conversation style) ensures consistent service and shows clients you value and remember them.', 'easy', 28
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'How should you handle a client who is always late?', 'Yell at them', 'Address it politely and enforce your late policy consistently', 'Accept it forever', 'Refuse to serve them', 'b', 'Address the issue politely but firmly. Remind them of your schedule, enforce your late policy consistently, and consider requiring deposits if it continues.', 'medium', 29
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT id, 'What is the most important thing to remember about barbering?', 'Making money', 'It''s a profession built on trust, skill, and human connection', 'Being the fastest', 'Having the most clients', 'b', 'Barbering is built on trust, skill, and human connection. Technical ability matters, but so does how you make people feel. That''s what creates a lasting career.', 'easy', 30
FROM quizzes WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 21);

-- Chapter 1 Flashcards (20)
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What were Egyptian barbers called?', 'Meryma\', 'ancient', 'medium', 0);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'Why did high-ranking Egyptians shave their heads?', 'For cleanliness and to wear wigs', 'ancient', 'medium', 1);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What simple tools were used in the glacial age for haircutting?', 'Sharpened flints, oyster shells, and bone', 'ancient', 'medium', 2);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'Which civilization first cultivated beauty extravagantly?', 'Ancient Egyptians', 'ancient', 'medium', 3);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What did hair symbolize in many ancient cultures?', 'Good and bad spirits entering/exiting the body', 'ancient', 'medium', 4);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'How did African cultures indicate status in hairstyles?', 'With carved combs, beads, clay, and colored bands', 'ancient', 'medium', 5);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What is a barber-surgeon?', 'Barbers who performed medical services', 'medieval', 'medium', 6);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What is the tonsure?', 'Shaving a patch on the crown of the head', 'medieval', 'medium', 7);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'When was the first barber guild formed?', '1096 in France', 'medieval', 'medium', 8);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What does the barber pole represent?', 'Bloodletting history: red=blood, white=bandages, blue=veins', 'medieval', 'medium', 9);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What services did barber-surgeons provide?', 'Haircuts, shaving, bloodletting, surgery, dentistry', 'medieval', 'medium', 10);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'When did barbers and surgeons officially separate in England?', '1745', 'modern', 'medium', 11);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'Who reunited barbers and surgeons in 1540?', 'King Henry VIII of England', 'modern', 'medium', 12);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'When did barbering arrive in America?', 'With early European colonists in the 1600s', 'modern', 'medium', 13);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What happened to barbering during the Great Depression?', 'Many barbers lost business as people cut hair at home', 'modern', 'medium', 14);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'When did barbering experience a renaissance?', 'Late 20th century with renewed interest in traditional techniques', 'modern', 'medium', 15);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What is NABBA?', 'National Association of State Boards of Barber Examiners', 'organizations', 'medium', 16);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'When was NABBA founded?', '1929', 'organizations', 'medium', 17);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What is the purpose of state barber boards?', 'To protect public health through licensing and regulation', 'organizations', 'medium', 18);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 1), 'What is a Master Barber?', 'A barber who has achieved the highest level of professional recognition', 'organizations', 'medium', 19);

-- Chapter 3 Flashcards (20)
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Professional Image?', 'The impression you project through appearance and conduct', 'Foundations', 'medium', 0);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'How quickly do clients form first impressions?', 'Within the first 7 seconds', 'First Impressions', 'medium', 1);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What are the Four Personal Hygiene Habits?', 'Daily shower, clean hair, fresh breath, clean nails', 'Hygiene', 'medium', 2);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'Why must barbers exemplify grooming standards?', 'Clients view barbers as grooming authorities', 'Barber as Expert', 'medium', 3);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What does ', 'You are your own marketing', 'Walking Advertisement', 'medium', 4);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Ergonomics?', 'Science of designing workplace for comfort, efficiency, and safety', 'Ergonomics', 'medium', 5);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What causes Musculoskeletal Disorders?', 'Repetitive motions and poor posture', 'Body Mechanics', 'medium', 6);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Stress Management?', 'Practicing routines to calm body and mind', 'Stress Management', 'medium', 7);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Body Language?', 'Nonverbal communication through posture, gestures, and expressions', 'Communication', 'medium', 8);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Confidentiality?', 'Keeping client information private', 'Professional Ethics', 'medium', 9);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'Why is good posture important?', 'Prevents musculoskeletal disorders and projects confidence', 'Posture', 'medium', 10);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Repetitive Motion?', 'Movements performed repeatedly during work', 'Repetitive Motion', 'medium', 11);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What are Human Relations?', 'Interactions and relationships between people', 'Human Relations', 'medium', 12);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Team Camaraderie?', 'Positive, supportive relationships with coworkers', 'Teamwork', 'medium', 13);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What are Healthful Habits?', 'Regular practices maintaining physical and mental health', 'Health', 'medium', 14);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What are consequences of poor professional image?', 'Lost clients, damaged reputation, reduced income', 'Consequences', 'medium', 15);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'How does professional appearance build trust?', 'Signals competence and attention to detail', 'Trust Building', 'medium', 16);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Hygiene?', 'Science of health maintenance and cleanliness', 'Hygiene Science', 'medium', 17);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'What is Personal Grooming?', 'Caring for body parts and maintaining polished look', 'Personal Grooming', 'medium', 18);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 3), 'Why is continuing self-improvement important?', 'Maintains and elevates professional standards', 'Professional Mindset', 'medium', 19);

-- Chapter 4 Flashcards (30)
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is the KEY difference between cleaning and disinfecting?', 'Cleaning removes visible dirt; disinfecting kills microorganisms', 'Core Concepts', 'medium', 0);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What are the FOUR levels of infection control in order?', '1) Cleaning 2) Sanitizing 3) Disinfecting 4) Sterilizing', 'Core Concepts', 'medium', 1);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is Universal Precaution?', 'Treat ALL blood and fluids as if infectious', 'Safety', 'medium', 2);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'How long can Hepatitis B survive in dried blood?', 'Up to 7 days', 'Pathogens', 'medium', 3);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What should you do FIRST after a cut/puncture exposure?', 'Let it bleed freely, then wash with soap and water', 'Safety', 'medium', 4);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What does EPA registration on a disinfectant prove?', 'EPA verified it kills the germs it claims to kill', 'Core Concepts', 'medium', 5);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is proper hand washing duration?', '20 seconds minimum', 'Procedures', 'medium', 6);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is the difference between antiseptics and disinfectants?', 'Antiseptics are for SKIN; disinfectants are for TOOLS/SURFACES', 'Core Concepts', 'medium', 7);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'Why should you NEVER recap a used razor blade?', 'Increases risk of needlestick or cut injuries', 'Safety', 'medium', 8);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is the critical limitation of disinfecting?', 'Does NOT kill bacterial spores', 'Core Concepts', 'medium', 9);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What are the THREE main bloodborne pathogens in barbering?', 'Hepatitis B, Hepatitis C, and HIV', 'Pathogens', 'medium', 10);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is the minimum alcohol percentage for effective hand sanitizer?', '60% alcohol', 'Safety', 'medium', 11);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What are the 8 steps for proper tool disinfection?', 'Clean, rinse, dry, immerse, wait (contact time), remove, rinse (if needed), store', 'Procedures', 'medium', 12);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is MRSA and why is it dangerous?', 'Methicillin-resistant Staph aureus - antibiotic resistant', 'Pathogens', 'medium', 13);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What does OSHA', 'Exposure control plan, training, PPE, Hepatitis B vaccine, sharps disposal', 'Core Concepts', 'medium', 14);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What are biofilms?', 'Protective microbial colonies that stick to surfaces', 'Pathogens', 'medium', 15);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is proper sharps disposal?', 'Puncture-resistant container, labeled, never overfill, proper final disposal', 'Procedures', 'medium', 16);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is the difference between infectious and contagious?', 'Infectious = caused by pathogens. Contagious = spreads easily person-to-person', 'Core Concepts', 'medium', 17);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is a systemic disease?', 'Disease affecting the entire body, often from gland dysfunction', 'Safety', 'medium', 18);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'Why should you never diagnose a client', 'Only licensed medical professionals can diagnose', 'Procedures', 'medium', 19);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is tinea barbae (barber', 'Fungal infection of the beard area', 'Pathogens', 'medium', 20);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is inflammation and its signs?', 'Body', 'Core Concepts', 'medium', 21);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is an occupational disease?', 'Illness from work conditions or hazards', 'Safety', 'medium', 22);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What are Quaternary Ammonium Compounds (Quats)?', 'Common disinfectants like Barbicide', 'Procedures', 'medium', 23);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'How do bacteria reproduce?', 'Binary fission - one cell divides into two', 'Pathogens', 'medium', 24);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is the difference between contamination and decontamination?', 'Contamination = presence of pathogens. Decontamination = removal of pathogens', 'Safety', 'medium', 25);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'Why is bleach not ideal for barber tools?', 'Corrosive to metals and can discolor', 'Procedures', 'medium', 26);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is the purpose of state barber boards?', 'Protect public health and safety through licensing', 'Core Concepts', 'medium', 27);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What should you do if a client has an open cut or wound?', 'Avoid the area and suggest medical attention', 'Safety', 'medium', 28);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 4), 'What is proper tool storage after disinfection?', 'Clean, covered container away from contaminants', 'Procedures', 'medium', 29);

-- Chapter 7 Flashcards (75)
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is chemistry?', 'The science that deals with the composition, structure, and properties of matter', 'chemistry-basics', 'medium', 0);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What does organic chemistry study?', 'Substances containing carbon', 'chemistry-basics', 'medium', 1);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What does inorganic chemistry study?', 'Substances without carbon', 'chemistry-basics', 'medium', 2);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'Which substances will burn?', 'Most organic substances', 'chemistry-basics', 'medium', 3);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is matter?', 'Anything that occupies space and has mass (weight)', 'chemistry-basics', 'medium', 4);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are physical properties?', 'Characteristics that can be determined without a chemical reaction', 'chemistry-basics', 'medium', 5);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are chemical properties?', 'Characteristics that can only be determined by chemical reaction', 'chemistry-basics', 'medium', 6);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a physical change?', 'A change in form without creating a new substance', 'chemistry-basics', 'medium', 7);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a chemical change?', 'A change that creates a new substance with different properties', 'chemistry-basics', 'medium', 8);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is oxidation?', 'A chemical reaction that combines a substance with oxygen', 'chemistry-basics', 'medium', 9);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is reduction?', 'The opposite of oxidation - removal of oxygen or addition of hydrogen', 'chemistry-basics', 'medium', 10);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is an oxidation-reduction reaction?', 'A chemical reaction involving both oxidation and reduction', 'chemistry-basics', 'medium', 11);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'How many states of matter exist?', 'Three (solid, liquid, gas)', 'matter', 'medium', 12);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'Which state has definite shape and volume?', 'Solid', 'matter', 'medium', 13);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'Which state has volume but no definite shape?', 'Liquid', 'matter', 'medium', 14);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'Which state has no definite shape or volume?', 'Gas', 'matter', 'medium', 15);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What happens when a solid becomes liquid?', 'Melting', 'matter', 'medium', 16);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What happens when a liquid becomes gas?', 'Evaporation or boiling', 'matter', 'medium', 17);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What happens when a gas becomes liquid?', 'Condensation', 'matter', 'medium', 18);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What happens when a liquid becomes solid?', 'Freezing or solidification', 'matter', 'medium', 19);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is sublimation?', 'When a solid changes directly to gas without becoming liquid', 'matter', 'medium', 20);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is the difference between weight and mass?', 'Mass is the amount of matter; weight is the pull of gravity on that mass', 'matter', 'medium', 21);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is an element?', 'The simplest form of chemical matter', 'elements', 'medium', 22);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'How many elements are known to science?', '118', 'elements', 'medium', 23);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are atoms?', 'The basic building blocks of all matter', 'elements', 'medium', 24);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are the three main parts of an atom?', 'Protons, neutrons, and electrons', 'elements', 'medium', 25);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a proton?', 'A positively charged particle in the atom\', 'elements', 'medium', 26);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a neutron?', 'A particle with no charge in the atom\', 'elements', 'medium', 27);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is an electron?', 'A negatively charged particle orbiting the nucleus', 'elements', 'medium', 28);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a molecule?', 'Two or more atoms chemically combined', 'elements', 'medium', 29);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is an elemental molecule?', 'A molecule made of two or more atoms of the same element', 'elements', 'medium', 30);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a compound molecule?', 'A molecule made of two or more atoms of different elements', 'elements', 'medium', 31);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a pure substance?', 'Matter with fixed chemical composition', 'mixtures', 'medium', 32);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a physical mixture?', 'Combination of substances united physically, not chemically', 'mixtures', 'medium', 33);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a solution?', 'A stable, uniform mixture of two or more miscible substances', 'mixtures', 'medium', 34);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a solute?', 'The substance that is dissolved in a solution', 'mixtures', 'medium', 35);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a solvent?', 'The substance that dissolves the solute', 'mixtures', 'medium', 36);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a suspension?', 'An unstable mixture with visible particles that settle over time', 'mixtures', 'medium', 37);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is an emulsion?', 'A mixture of two immiscible (unmixable) liquids', 'mixtures', 'medium', 38);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a surfactant?', 'A substance that allows oil and water to mix', 'mixtures', 'medium', 39);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is an oil-in-water emulsion?', 'Oil droplets dispersed in water', 'mixtures', 'medium', 40);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a water-in-oil emulsion?', 'Water droplets dispersed in oil', 'mixtures', 'medium', 41);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What does pH measure?', 'The acidity or alkalinity of a substance', 'ph', 'medium', 42);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is the pH scale range?', '0 to 14', 'ph', 'medium', 43);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What pH is neutral?', '7', 'ph', 'medium', 44);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What pH range is acidic?', '0 to 6.9', 'ph', 'medium', 45);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What pH range is alkaline (basic)?', '7.1 to 14', 'ph', 'medium', 46);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is the normal pH range of hair and skin?', '4.5 to 5.5', 'ph', 'medium', 47);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What do acidic products do to hair?', 'Contract and harden the hair; close the cuticle', 'ph', 'medium', 48);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What do alkaline products do to hair?', 'Soften and swell the hair; open the cuticle', 'ph', 'medium', 49);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What do acids taste like?', 'Sour', 'ph', 'medium', 50);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What do alkalis taste like?', 'Bitter', 'ph', 'medium', 51);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is neutralization?', 'When an acid and alkali combine to form a salt and water', 'ph', 'medium', 52);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What pH are most hair relaxers?', '9.0 to 14', 'ph', 'medium', 53);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is the primary function of shampoo?', 'To cleanse the hair and scalp by removing dirt, oil, and product buildup', 'shampoos', 'medium', 54);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are anionic surfactants?', 'Relatively harsh cleansers that produce rich foam', 'shampoos', 'medium', 55);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are cationic surfactants used for?', 'Antibacterial action in dandruff shampoos', 'shampoos', 'medium', 56);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are nonionic surfactants?', 'Mild cleansing agents with low irritation', 'shampoos', 'medium', 57);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are amphoteric surfactants used for?', 'Baby shampoos because they are nonirritating to eyes', 'shampoos', 'medium', 58);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a pH-balanced shampoo?', 'Shampoo formulated to match hair\', 'shampoos', 'medium', 59);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a clarifying shampoo?', 'Deep-cleansing formula that removes heavy buildup', 'shampoos', 'medium', 60);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a medicated shampoo?', 'Contains active ingredients to treat scalp conditions', 'shampoos', 'medium', 61);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a balancing shampoo?', 'Cleanses and helps balance moisture and pH', 'shampoos', 'medium', 62);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a color-enhancing shampoo?', 'Contains color pigments to maintain or enhance hair color', 'shampoos', 'medium', 63);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a conditioning shampoo?', 'Contains conditioning agents to add moisture while cleansing', 'shampoos', 'medium', 64);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What do conditioners do?', 'Deposit protein or moisture to restore strength and add shine', 'conditioners', 'medium', 65);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is an instant (rinse-out) conditioner?', 'Applied after shampooing and rinsed out after 1-3 minutes', 'conditioners', 'medium', 66);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a deep (treatment) conditioner?', 'Heavier formula left on longer, often with heat', 'conditioners', 'medium', 67);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is a leave-in conditioner?', 'Lightweight formula NOT rinsed out', 'conditioners', 'medium', 68);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are humectants?', 'Compounds that attract and retain moisture', 'conditioners', 'medium', 69);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What are silicones in conditioners?', 'Ingredients that form a breathable film on hair', 'conditioners', 'medium', 70);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is the most abundant chemical on Earth?', 'Water (H2O)', 'products', 'medium', 71);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What percentage of the human body is water?', 'About 65%', 'products', 'medium', 72);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What do astringents do?', 'Cause contraction of tissues and remove excess oil', 'products', 'medium', 73);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 7), 'What is hydrogen peroxide used for in barbering?', 'Bleaching agent for hair and disinfectant', 'products', 'medium', 74);

-- Chapter 8 Flashcards (35)
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the difference between AC and DC current?', 'AC (Alternating Current) changes direction periodically and comes from wall outlets. DC (Direct Current) flows in one direction only, like from batteries.', 'basics', 'medium', 0);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'Name three good electrical conductors.', 'Copper, silver, aluminum, and water (when it contains minerals) are all good conductors of electricity.', 'basics', 'medium', 1);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What does GFCI stand for and what does it do?', 'Ground Fault Circuit Interrupter. It detects current leaks and shuts off power in milliseconds to prevent electric shock. Required near sinks.', 'safety', 'medium', 2);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the formula for calculating watts?', 'Watts = Volts × Amps (W = V × A). This tells you the actual power a device uses.', 'measurements', 'medium', 3);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'Why should barbers never use electrical tools with wet hands?', 'Water is a conductor. Wet hands create a path for electricity to flow through the body, causing electric shock.', 'safety', 'medium', 4);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What are the benefits of infrared light therapy?', 'Increases blood circulation, relaxes facial muscles, opens pores for deep cleansing, soothes irritated skin, and promotes healing.', 'light', 'medium', 5);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the main benefit of ultraviolet (UV) light in barbering?', 'UV light kills bacteria and germs by disrupting their DNA. It', 'light', 'medium', 6);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the difference between the positive and negative poles in galvanic current?', 'Positive (+) pole produces an acid reaction that soothes and tightens. Negative (-) pole produces an alkaline reaction that stimulates and softens.', 'electrotherapy', 'medium', 7);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'List three warning signs of electrical problems.', 'Frayed cords, warm outlets, burning smells, sparks when plugging in, and tingling sensations from tools.', 'safety', 'medium', 8);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'Why is the third prong on a plug important?', 'The third prong is the ground. It provides a safe path for electricity to travel if a malfunction occurs, preventing shocks.', 'safety', 'medium', 9);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What precautions should be taken when using high frequency machines?', 'Remove metal jewelry, avoid use on clients with pacemakers, never use on broken skin, start at lowest intensity, and stop if client feels pain.', 'electrotherapy', 'medium', 10);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'How does a circuit breaker protect the barbershop?', 'Circuit breakers automatically shut off power when too much current flows (overload), preventing overheating and fires.', 'safety', 'medium', 11);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is iontophoresis and how is it used?', 'Iontophoresis uses galvanic current to help water-soluble products penetrate deeper into the skin during facial treatments.', 'electrotherapy', 'medium', 12);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'Why is understanding ohms (resistance) important?', 'Damaged cords increase resistance, which creates heat and fire risk. Understanding resistance helps recognize unsafe equipment.', 'measurements', 'medium', 13);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What should a barber do if a client feels tingling from a tool?', 'Stop using the tool immediately. Unplug it and inspect for damage. Do not use again until professionally inspected.', 'safety', 'medium', 14);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the difference between cataphoresis and anaphoresis?', 'Cataphoresis uses the positive (+) pole to push acidic products into skin. Anaphoresis uses the negative (-) pole for alkaline reactions.', 'electrotherapy', 'medium', 15);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is desincrustation?', 'A deep cleansing process using galvanic current with the negative (-) pole to emulsify sebum and impurities in pores.', 'electrotherapy', 'medium', 16);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is Tesla high-frequency current?', 'Also called Violet Ray, it uses rapid oscillating current producing a violet glow, ozone, and mild heat for scalp stimulation.', 'electrotherapy', 'medium', 17);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is microcurrent therapy?', 'Uses extremely low-level currents (microamps) that mirror the body', 'electrotherapy', 'medium', 18);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is a complete circuit?', 'A closed path allowing electricity to flow from the power source, through the device (load), and back to the source.', 'basics', 'medium', 19);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What are the four main components of an electrical circuit?', '1) Power Source, 2) Conductor (wire), 3) Load (device), and 4) Switch (controls flow).', 'basics', 'medium', 20);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is Ohm', 'Voltage = Current × Resistance (V = I × R). Helps understand why damaged cords with higher resistance create fire hazards.', 'measurements', 'medium', 21);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What are LED therapy lights?', 'Light Emitting Diodes that emit specific wavelengths. Red LED is anti-inflammatory; Blue LED is antibacterial.', 'light', 'medium', 22);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'Why shouldn', 'The third prong is the ground wire. Removing it eliminates crucial safety protection against electric shock.', 'safety', 'medium', 23);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What medical conditions contraindicate electrotherapy?', 'Pacemakers, epilepsy, heart conditions, pregnancy, and metal implants in the treatment area.', 'electrotherapy', 'medium', 24);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is a volt?', 'The unit of electrical pressure that pushes current through a conductor. US wall outlets are 110-120V.', 'measurements', 'medium', 25);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is an ampere (amp)?', 'The unit measuring the amount of electrical current flowing through a circuit. Hair dryers draw 10-15 amps.', 'measurements', 'medium', 26);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is an insulator?', 'A material that resists electrical flow, such as rubber, plastic, glass, and wood. Used for safety protection.', 'basics', 'medium', 27);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the purpose of laser therapy in barbering?', 'Low-level laser therapy (LLLT) stimulates hair follicles, increases blood flow, and promotes hair growth.', 'light', 'medium', 28);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is grounding in electrical systems?', 'A safety path that directs excess electricity safely into the earth, preventing shocks and equipment damage.', 'safety', 'medium', 29);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the difference between a closed and open circuit?', 'A closed circuit allows electricity to flow (device works). An open circuit stops flow (device is off).', 'basics', 'medium', 30);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is a load in an electrical circuit?', 'Any device that uses electrical power, such as clippers, hair dryers, lamps, and treatment devices.', 'basics', 'medium', 31);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What are the benefits of high-frequency treatments?', 'Stimulates blood circulation, promotes healing, reduces bacteria through ozone, and soothes skin after shaving.', 'electrotherapy', 'medium', 32);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'What is the proper distance for infrared lamps?', 'Keep infrared lamps 12-18 inches from the skin and limit treatment to 5-10 minutes to prevent burns.', 'light', 'medium', 33);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 8), 'Why is water dangerous around electricity?', 'Water is a conductor. When mixed with minerals (impure), it conducts electricity easily, creating shock hazards.', 'safety', 'medium', 34);

-- Chapter 15 Flashcards (199)
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What was the original term for men', 'Toupee - a small wig or artificial hairpiece worn to cover a bald spot', 'history', 'medium', 0);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a ', 'An early hairpiece designed to cover only the front/top balding area of the head', 'history', 'medium', 1);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What term replaced ', 'Hair replacement system or hair solution - more professional and dignified terminology', 'history', 'medium', 2);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why did the terminology change from ', 'To remove stigma and negative associations, making the service more professional and appealing', 'history', 'medium', 3);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are the three main reasons men purchase hair replacement systems?', '1) Appearance/self-confidence, 2) Professional image, 3) Social/dating life improvement', 'history', 'medium', 4);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What percentage of men experience noticeable hair loss by age 50?', 'Approximately 50% of men experience significant hair loss by age 50', 'history', 'medium', 5);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the medical term for male pattern baldness?', 'Androgenetic alopecia - the most common cause of hair loss in men', 'history', 'medium', 6);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the primary hormone responsible for male pattern baldness?', 'Dihydrotestosterone (DHT) - a derivative of testosterone that shrinks hair follicles', 'history', 'medium', 7);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is privacy important during hair replacement consultations?', 'Hair loss is emotionally sensitive; clients need to feel safe discussing personal concerns without embarrassment', 'consultation', 'medium', 8);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are the four main options to discuss with clients experiencing hair loss?', '1) Hair replacement systems, 2) Surgical options, 3) Laser therapy, 4) Topical medications', 'consultation', 'medium', 9);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What lifestyle factors should be considered when recommending a hair system?', 'Activity level, swimming habits, exercise routine, sleeping habits, and maintenance willingness', 'consultation', 'medium', 10);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How does age factor into hair replacement recommendations?', 'Younger clients may want progressive coverage; older clients may prefer simplicity and comfort', 'consultation', 'medium', 11);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is budget discussion important during consultation?', 'Systems vary widely in cost; understanding budget helps recommend appropriate options without pressure', 'consultation', 'medium', 12);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the ', 'A quick measurement technique to determine where the hairline should be placed on the forehead', 'consultation', 'medium', 13);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Where should the hairline typically be placed using the four fingers method?', 'Four fingers width above the eyebrows is the standard starting point for a natural hairline', 'consultation', 'medium', 14);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a client record card used for in hair replacement?', 'Documenting measurements, hair color, density, base size, style preferences, and service history', 'consultation', 'medium', 15);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be assessed during scalp examination?', 'Scalp condition, oiliness, sensitivity, existing hair density, and any skin conditions', 'consultation', 'medium', 16);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why ask about allergies during consultation?', 'Adhesives, tapes, and cleaning solvents may cause allergic reactions; patch testing may be needed', 'consultation', 'medium', 17);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the purpose of a patch test?', 'To check for allergic reactions to adhesives or tapes 24 hours before application', 'consultation', 'medium', 18);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How far in advance should a patch test be performed?', '24 hours before the scheduled application to allow time for any reaction to appear', 'consultation', 'medium', 19);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be discussed regarding maintenance expectations?', 'Cleaning frequency, reattachment schedules, styling time, and professional service intervals', 'consultation', 'medium', 20);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the most effective approach to selling hair replacement systems?', 'Personal, consultative approach - understanding client needs rather than hard-selling', 'marketing', 'medium', 21);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is demonstration important in selling hair systems?', 'Clients need to see and feel the product; hands-on experience reduces anxiety and builds confidence', 'marketing', 'medium', 22);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a trial period in hair replacement sales?', 'Allowing clients to wear a system temporarily to experience comfort and appearance before committing', 'marketing', 'medium', 23);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is social media marketing for hair replacement?', 'Using platforms like Instagram/Facebook to showcase before/after transformations (with permission)', 'marketing', 'medium', 24);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why are model releases important for marketing?', 'Legal documentation allowing use of client', 'marketing', 'medium', 25);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the ', 'Staff or barbers who wear systems sharing their own positive experiences with clients', 'marketing', 'medium', 26);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why are referrals powerful in hair replacement marketing?', 'Word-of-mouth from satisfied clients is highly credible; offer referral incentives', 'marketing', 'medium', 27);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How can window displays attract hair replacement clients?', 'Showcasing systems on mannequins, before/after photos, or informational displays', 'marketing', 'medium', 28);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be included in a shop hair replacement display?', 'Sample bases, color rings, hair density charts, before/after photos, and informational brochures', 'marketing', 'medium', 29);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is discretion important in print advertising?', 'Clients value privacy; ads should be tasteful and avoid making potential clients feel exposed', 'marketing', 'medium', 30);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are cover-up hair fibers?', 'Keratin fibers that cling to existing hair to create the appearance of thickness (Toppik, Caboki)', 'alternatives', 'medium', 31);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is hair transplantation surgery?', 'Surgical procedure moving hair follicles from donor areas to balding areas', 'alternatives', 'medium', 32);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is scalp reduction surgery?', 'Surgical removal of bald scalp areas, stretching hair-bearing skin to cover the area', 'alternatives', 'medium', 33);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is flap surgery in hair restoration?', 'Moving a section of hair-bearing scalp with blood supply intact to cover a bald area', 'alternatives', 'medium', 34);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is minoxidil (Rogaine)?', 'Topical medication that stimulates hair growth; available over-the-counter', 'alternatives', 'medium', 35);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is finasteride (Propecia)?', 'Prescription oral medication that blocks DHT to prevent further hair loss', 'alternatives', 'medium', 36);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is low-light laser therapy (LLLT)?', 'Treatment using red light to stimulate hair follicles and promote growth', 'alternatives', 'medium', 37);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are the limitations of topical medications?', 'Must be used continuously; results vary; may cause side effects; doesn', 'alternatives', 'medium', 38);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why might clients choose systems over surgery?', 'Non-invasive, immediate results, reversible, less expensive, no recovery time', 'alternatives', 'medium', 39);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are the three main types of hair used in replacement systems?', 'Human hair, synthetic hair, and mixed hair (animal or blended)', 'hair-types', 'medium', 40);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the main advantage of human hair in systems?', 'Most natural appearance, feel, and movement; can be styled with heat and colored', 'hair-types', 'medium', 41);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are disadvantages of human hair systems?', 'More expensive, requires more maintenance, reacts to weather/humidity, fades with washing', 'hair-types', 'medium', 42);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Where does human hair for systems typically come from?', 'Various sources including India, China, Europe, and Russia; may be virgin or processed', 'hair-types', 'medium', 43);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is ', 'Hair that has never been chemically processed (no color, perm, or treatment)', 'hair-types', 'medium', 44);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is processed human hair?', 'Hair that has been chemically treated to remove cuticle, change color, or alter texture', 'hair-types', 'medium', 45);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is Kanekalon?', 'A high-quality synthetic fiber widely used in hair systems; holds style well', 'hair-types', 'medium', 46);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are advantages of synthetic hair?', 'Less expensive, holds style after washing, low maintenance, color doesn', 'hair-types', 'medium', 47);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are disadvantages of synthetic hair?', 'Less natural appearance, cannot use heat styling, limited styling options, shorter lifespan', 'hair-types', 'medium', 48);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is ', 'Hair from animals like horse, yak, angora, or wool, sometimes blended with human hair', 'hair-types', 'medium', 49);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why use animal hair in systems?', 'Less expensive than human hair; specific textures may match certain client hair types', 'hair-types', 'medium', 50);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is ', 'Arranging hair so roots are aligned in the same direction to prevent tangling', 'hair-types', 'medium', 51);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is root-turning important?', 'Prevents matting and tangling; ensures natural movement and longevity of the system', 'hair-types', 'medium', 52);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Can synthetic hair be colored?', 'No, synthetic hair cannot be colored with regular hair color; special dyes exist but are limited', 'hair-types', 'medium', 53);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Can human hair systems receive chemical services?', 'Yes, human hair can be colored, permed, and chemically treated like natural hair', 'hair-types', 'medium', 54);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the ', 'The foundation material that hair is attached to; sits directly on the scalp', 'base', 'medium', 55);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are the two main construction methods for hair systems?', 'Machine-made and handmade (hand-tied) systems', 'base', 'medium', 56);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the difference between machine-made and handmade systems?', 'Machine-made: faster production, lower cost, less natural; Handmade: more natural, customizable, expensive', 'base', 'medium', 57);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a silk base?', 'Premium base material with hair knots hidden between layers; most realistic scalp appearance', 'base', 'medium', 58);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a lace base?', 'Sheer, breathable mesh material; popular for front hairlines due to natural appearance', 'base', 'medium', 59);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is French lace?', 'Durable lace material; slightly thicker than Swiss lace but longer lasting', 'base', 'medium', 60);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is Swiss lace?', 'Very fine, delicate lace; most natural appearance but less durable than French lace', 'base', 'medium', 61);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is thin skin (polyurethane) base?', 'Transparent plastic material that mimics skin; good for undetectable bonding', 'base', 'medium', 62);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a monofilament base?', 'Fine mesh material where each hair is individually hand-tied; very durable and natural', 'base', 'medium', 63);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is nylon mesh base?', 'Lightweight, breathable mesh; commonly used in less expensive systems', 'base', 'medium', 64);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is single knotting?', 'Hair is tied with a single knot to the base; natural appearance but less secure', 'base', 'medium', 65);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is double knotting?', 'Hair is tied with two knots; more secure and durable but slightly more visible', 'base', 'medium', 66);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is V-looping?', 'Hair is looped through the base without knots; creates most natural hair growth appearance', 'base', 'medium', 67);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Which knotting method is most durable?', 'Double knotting - provides the strongest hold but is more visible at the base', 'base', 'medium', 68);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Which knotting method is most natural-looking?', 'V-looping - no visible knots, hair appears to grow directly from the scalp', 'base', 'medium', 69);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a stock (pre-custom) hair system?', 'Pre-manufactured systems in standard sizes, colors, and densities; ready to ship', 'systems', 'medium', 70);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are advantages of stock systems?', 'Lower cost, immediate availability, can be tried on before purchase', 'systems', 'medium', 71);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are disadvantages of stock systems?', 'May not fit perfectly, limited color/style options, may require customization', 'systems', 'medium', 72);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a custom hair solution?', 'System made to exact client specifications including measurements, color, density, and style', 'systems', 'medium', 73);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are advantages of custom systems?', 'Perfect fit, exact color match, personalized density and style, most natural appearance', 'systems', 'medium', 74);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are disadvantages of custom systems?', 'More expensive, longer production time (weeks), cannot be returned if unsatisfied', 'systems', 'medium', 75);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a template in custom systems?', 'A pattern made from the client', 'systems', 'medium', 76);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is contour analysis?', 'Evaluating the shape and curves of the client', 'systems', 'medium', 77);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How long does custom system production typically take?', 'Usually 6-12 weeks depending on manufacturer and complexity', 'systems', 'medium', 78);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a ', 'Visual reference showing different hair density levels (light, medium, heavy) for selection', 'systems', 'medium', 79);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a color ring?', 'Physical ring with multiple hair color swatches used to match client', 'systems', 'medium', 80);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is hair density selection important?', 'Must match client', 'systems', 'medium', 81);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What supplies are needed for hair replacement services?', 'Adhesive remover, alcohol, blow dryer, clippers, combs, tape, adhesive, scissors, template materials', 'systems', 'medium', 82);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is adhesive remover used for?', 'Safely dissolves and removes bonding agents and tape residue from scalp and system', 'systems', 'medium', 83);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is 99% alcohol used in hair replacement?', 'Cleans and prepares the scalp; removes oils for better adhesion; sanitizes tools', 'systems', 'medium', 84);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What types of tape are used for hair systems?', 'Double-sided medical-grade tapes in various shapes: straight strips, contour shapes, mini-tabs', 'systems', 'medium', 85);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is liquid adhesive (bonding agent)?', 'Medical-grade glue applied to scalp or base for secure attachment of the system', 'systems', 'medium', 86);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What questions should be asked when selecting a manufacturer?', 'Quality, turnaround time, warranty, return policy, customization options, minimum orders', 'systems', 'medium', 87);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is Procedure 15-1: Making a Template?', 'Creating a precise pattern of the client', 'procedures', 'medium', 88);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What materials are needed to make a template?', 'Plastic wrap, clear tape, permanent marker, scissors, and template paper', 'procedures', 'medium', 89);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are the steps in making a template?', '1) Cover area with plastic wrap, 2) Tape over wrap, 3) Mark hairline and contours, 4) Cut out template', 'procedures', 'medium', 90);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is Procedure 15-2: Making a Plaster Mold Form?', 'Creating a 3D replica of the client', 'procedures', 'medium', 91);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What materials are needed for a plaster mold?', 'Plaster bandages, petroleum jelly, water bowl, bald cap or plastic wrap, scissors', 'procedures', 'medium', 92);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why use petroleum jelly when making a plaster mold?', 'Prevents plaster from sticking to hair and skin; essential for safe removal', 'procedures', 'medium', 93);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is full head bonding?', 'Attaching a complete hair system using adhesive or tape across the entire base perimeter', 'procedures', 'medium', 94);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a partial hair replacement system?', 'Covers only specific balding areas while blending with client', 'procedures', 'medium', 95);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is a lace-front hair solution?', 'System with sheer lace at the front hairline for the most natural, undetectable appearance', 'procedures', 'medium', 96);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is a lace-front attached?', 'Lace is trimmed to match hairline, adhesive applied to lace only, positioned and pressed into place', 'procedures', 'medium', 97);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is facial hair replacement?', 'Systems designed for mustaches, sideburns, beards, or goatees', 'procedures', 'medium', 98);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How are facial hair systems different from scalp systems?', 'Smaller, different base materials for flexibility, designed for different movement and styling', 'procedures', 'medium', 99);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is Procedure 15-5: Customizing a Stock System?', 'Modifying a pre-made system to better fit the client', 'procedures', 'medium', 100);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What modifications can be made to stock systems?', 'Cutting base to size, adding or removing hair density, color adjustments, styling', 'procedures', 'medium', 101);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why might a stock system need customization?', 'To improve fit, match client', 'procedures', 'medium', 102);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How often should synthetic systems be cleaned?', 'Every 2-4 weeks depending on lifestyle, oiliness, and product buildup', 'maintenance', 'medium', 103);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How often should human hair systems be cleaned?', 'Every 1-2 weeks; more frequently if using styling products or if scalp is oily', 'maintenance', 'medium', 104);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the basic cleaning process for systems?', 'Remove, soak in shampoo solution, gently clean, rinse, condition, rinse, towel dry, style', 'maintenance', 'medium', 105);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What products should be avoided on synthetic hair?', 'Heat styling tools, regular hair color, products with alcohol, oil-based products', 'maintenance', 'medium', 106);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is reconditioning treatment?', 'Deep conditioning treatment to restore moisture and shine to human hair systems', 'maintenance', 'medium', 107);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How often should reconditioning treatments be done?', 'Every 4-6 weeks or when hair becomes dry, dull, or tangled', 'maintenance', 'medium', 108);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Can human hair systems be permed?', 'Yes, but only with gentle formulations and by experienced professionals', 'maintenance', 'medium', 109);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the lifespan of a synthetic system?', 'Typically 3-6 months with proper care', 'maintenance', 'medium', 110);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the lifespan of a human hair system?', 'Typically 6-12 months with proper care; some high-quality systems last longer', 'maintenance', 'medium', 111);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should systems be stored when not being worn?', 'On a wig stand or mannequin head, away from direct sunlight, heat, and dust', 'maintenance', 'medium', 112);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the proper way to brush a hair system?', 'Start from ends, work up to roots; use wide-tooth comb or specialized wig brush', 'maintenance', 'medium', 113);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Can clients sleep in their hair systems?', 'Yes, but a sleep cap is recommended to reduce friction and extend system life', 'maintenance', 'medium', 114);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How often should systems be professionally serviced?', 'Every 2-4 weeks for cleaning, reattachment, and styling maintenance', 'maintenance', 'medium', 115);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What causes a system to lose its shine?', 'Product buildup, washing with hard water, exposure to sun, and normal wear over time', 'maintenance', 'medium', 116);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How can tangling be prevented?', 'Regular brushing, proper washing technique, conditioner use, and avoiding friction', 'maintenance', 'medium', 117);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are general recommendations for cutting hair systems?', 'Use sharp shears, cut in small sections, follow natural flow, blend with existing hair', 'maintenance', 'medium', 118);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should the top section of a system be cut?', 'Cut to desired length and style; can be layered, textured, or left blunt', 'maintenance', 'medium', 119);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should sides be blended with natural hair?', 'Use tapering and blending techniques to create seamless transition between system and natural hair', 'maintenance', 'medium', 120);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'When should thinning shears be used on systems?', 'To reduce bulk, create texture, or blend with finer natural hair; use carefully', 'maintenance', 'medium', 121);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is cutting a system different from cutting natural hair?', 'Hair doesn', 'maintenance', 'medium', 122);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the importance of consulting the client before cutting?', 'Ensures desired style; hair cannot be replaced once cut; manage expectations', 'maintenance', 'medium', 123);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What are clean-up procedures after hair replacement service?', 'Dispose of used tape and materials, sanitize tools, clean work area, wash hands', 'safety', 'medium', 124);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should tools be disinfected?', 'Clean with soap and water, then immerse in EPA-registered disinfectant for required time', 'safety', 'medium', 125);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the importance of tool maintenance?', 'Sharp, clean tools work better and prevent damage to the system and client injury', 'safety', 'medium', 126);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What PPE should be worn during services?', 'Gloves when using chemicals or adhesives; apron to protect clothing', 'safety', 'medium', 127);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should adhesive removers be handled?', 'Use in well-ventilated area, avoid skin contact when possible, follow manufacturer instructions', 'safety', 'medium', 128);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be done if a client has a reaction to adhesive?', 'Remove system immediately, clean area, apply soothing treatment, recommend medical attention if severe', 'safety', 'medium', 129);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should chemical products be stored?', 'In original containers, tightly sealed, away from heat and direct sunlight, out of reach of children', 'safety', 'medium', 130);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is Universal Precaution?', 'Treating all blood and bodily fluids as potentially infectious; using barrier protection', 'safety', 'medium', 131);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is ventilation important in hair replacement services?', 'Many adhesives and solvents emit fumes that can cause headaches or respiratory irritation', 'safety', 'medium', 132);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should sharp tools be handled?', 'Never pass blade-first; store in protective cases; dispose of blades in sharps container', 'safety', 'medium', 133);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'In Procedure 15-3 Step 5, how do you place the hair system for full head bonding?', 'Place the system on the client', 'procedures', 'medium', 134);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What tool is used in Step 6 to mark the hairline position?', 'An eyeliner pencil is used to mark the placement of the hair system', 'procedures', 'medium', 135);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why must you shake the adhesive before application in Step 7?', 'To ensure all ingredients are properly mixed for effective bonding', 'procedures', 'medium', 136);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What motion is used when applying adhesive in Step 8?', 'Apply adhesive in a circular motion using a makeup sponge', 'procedures', 'medium', 137);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How many coats of adhesive are applied in full head bonding?', 'Four coats total, allowing each coat to dry before applying the next', 'procedures', 'medium', 138);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Where should adhesive be applied on the hair system base?', 'Apply adhesive to the base of the system, NOT directly on the lace material', 'procedures', 'medium', 139);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the purpose of the towel stretch technique?', 'To ensure an even, wrinkle-free fit across the entire scalp', 'procedures', 'medium', 140);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How do you check for wrinkles after applying the system?', 'Use the back of a comb to check the perimeter for any wrinkles or bubbles', 'procedures', 'medium', 141);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How long should a client wait before shampooing after full head bonding?', '24-48 hours waiting period to allow the adhesive to fully cure', 'procedures', 'medium', 142);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What happens if the client shampoos too soon after bonding?', 'The adhesive bond may weaken or fail completely, causing the system to loosen', 'procedures', 'medium', 143);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the first step when applying a lace-front hair solution?', 'Clean the bald area thoroughly to remove oils and debris', 'procedures', 'medium', 144);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the ', 'Placing the front edge four fingers above the eyebrows for natural placement', 'procedures', 'medium', 145);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is tape attached for lace-front application?', 'Remove backing and attach tape to the perimeter of the bald area', 'procedures', 'medium', 146);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be used to remove a lace-front system?', 'Acetone or adhesive solvent to dissolve the bond - never pull or stretch the lace', 'procedures', 'medium', 147);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why should you never pull or stretch lace when removing?', 'Lace is delicate and can tear or lose its shape permanently', 'procedures', 'medium', 148);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What tape pattern is used for non-lace-front systems?', 'V-shape tape placement for secure attachment', 'procedures', 'medium', 149);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Where is the front edge placed on non-lace-front systems?', 'Four fingers above the eyebrow, similar to lace-front placement', 'procedures', 'medium', 150);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How do you remove a non-lace-front system?', 'Detach the tape carefully, then reactivate any remaining adhesive with spirit gum remover', 'procedures', 'medium', 151);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is spirit gum used for in system removal?', 'To reactivate and dissolve adhesive residue for easier, safer removal', 'procedures', 'medium', 152);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is acetone effective for lace-front removal?', 'It dissolves the adhesive bond without damaging the lace material', 'procedures', 'medium', 153);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is used to create a template for customizing a stock system?', 'Plastic wrap and tape to create a precise pattern of the client', 'procedures', 'medium', 154);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be done before cutting a stock system base?', 'Shampoo and condition the hair system first', 'procedures', 'medium', 155);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is the canvas block prepared for customization?', 'Cover with a plastic cap and secure the system for stable cutting', 'procedures', 'medium', 156);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What tool is used to cut the base material?', 'A razor blade for precise, clean cuts following the template', 'procedures', 'medium', 157);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How do you check the fit after cutting the base?', 'Place the customized system on the client', 'procedures', 'medium', 158);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be done after cutting and fitting the system?', 'Rinse to remove any excess conditioner before final styling', 'procedures', 'medium', 159);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why use a template when customizing stock systems?', 'To ensure the base matches the client', 'procedures', 'medium', 160);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the advantage of customizing a stock system?', 'Better fit and more natural appearance while keeping costs lower than fully custom', 'procedures', 'medium', 161);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the first step in cleaning a human hair system?', 'Remove old tape and clean reinforced areas of residue', 'procedures', 'medium', 162);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How long should the system soak in cleaning solution?', 'Submerge for 3-5 minutes to loosen dirt and oils', 'procedures', 'medium', 163);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What motion is used while cleaning in solution?', 'Swish the system back and forth gently - never scrub or twist', 'procedures', 'medium', 164);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How do you clean the edges of the system?', 'Gently tap the edge with a soft brush or fingers to remove buildup', 'procedures', 'medium', 165);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the towel pressing technique?', 'Press (not rub) the system between towels to remove excess water', 'procedures', 'medium', 166);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should you comb a wet hair system?', 'Comb gently from ends to roots using a wide-tooth comb', 'procedures', 'medium', 167);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is the system secured for drying?', 'Fasten to a wig block using T-pins to maintain shape', 'procedures', 'medium', 168);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the final step after cleaning?', 'Blow-dry and style as desired', 'procedures', 'medium', 169);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why avoid rubbing the hair when towel drying?', 'Rubbing causes tangling, frizz, and damage to the hair fibers', 'procedures', 'medium', 170);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the first step in cleaning a wig?', 'Brush thoroughly to remove surface dirt and tangles', 'procedures', 'medium', 171);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What solution is used for cleaning wigs?', 'Mix warm water with wig cleaning solution or mild shampoo', 'procedures', 'medium', 172);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is the wig immersed for cleaning?', 'Dip the entire wig into the solution, ensuring full saturation', 'procedures', 'medium', 173);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What water temperature is used for rinsing wigs?', 'Rinse in cold water to seal the cuticle and maintain shine', 'procedures', 'medium', 174);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How do you remove excess water from a wig?', 'Blot dry with towels - never wring or twist', 'procedures', 'medium', 175);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why turn the wig inside out after cleaning?', 'To allow the cap and base to dry properly and maintain shape', 'procedures', 'medium', 176);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is a wig secured for drying?', 'Pin to a head mold or wig block to maintain proper shape', 'procedures', 'medium', 177);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be done while the wig is damp?', 'Brush into place to set the style as it dries', 'procedures', 'medium', 178);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How should wigs be dried?', 'Allow to dry naturally or use cool air - never heat on synthetic wigs', 'procedures', 'medium', 179);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What type of hair systems can be colored?', 'Only 100% human hair systems can be colored safely', 'procedures', 'medium', 180);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What must be done before coloring a hair system?', 'Clean the system with solvent to remove all oils and residue', 'procedures', 'medium', 181);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is the head form prepared for coloring?', 'Cover with plastic to protect from color stains', 'procedures', 'medium', 182);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How is the system secured to the head form?', 'Use T-pins to fasten the system securely in place', 'procedures', 'medium', 183);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why perform a strand test before coloring?', 'To test color results and check for any adverse reactions', 'procedures', 'medium', 184);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How often should you check color development?', 'Test every 5 minutes to monitor color progression', 'procedures', 'medium', 185);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What is the final process after achieving desired color?', 'Rinse thoroughly, shampoo, and condition the hair', 'procedures', 'medium', 186);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why can', 'Synthetic fibers don', 'procedures', 'medium', 187);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What happens if you color a synthetic system with regular color?', 'The fibers may melt, become damaged, or not take the color at all', 'procedures', 'medium', 188);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What type of perm solution should be used on bleached/damaged hair systems?', 'Select a mild solution specifically formulated for processed hair', 'procedures', 'medium', 189);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why must T-pins be removed before perming?', 'Metal can react with perm chemicals and cause damage or discoloration', 'procedures', 'medium', 190);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How often should you check a test curl during perming?', 'Check the test curl every minute to monitor curl formation', 'procedures', 'medium', 191);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How long should the system be rinsed after perming?', 'Rinse thoroughly for 10-15 minutes to remove all perm solution', 'procedures', 'medium', 192);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Is neutralizing solution needed for hair system perms?', 'No neutralizing solution is needed - this is different from natural hair perms', 'procedures', 'medium', 193);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'What should be done with rods after rinsing?', 'Blot rods with paper towels to remove excess water', 'procedures', 'medium', 194);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How long should rods remain in the hair?', 'Leave rods in for 24 hours covered with a plastic cap', 'procedures', 'medium', 195);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'How long should the system dry after perming?', 'Dry for another full day before removing rods', 'procedures', 'medium', 196);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'When can rods be safely removed after perming?', 'Only when the hair is completely dry - premature removal ruins the curl', 'procedures', 'medium', 197);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 15), 'Why is the drying period so long for permed systems?', 'The curl must set completely; rushing the process results in weak or failed curls', 'procedures', 'medium', 198);

-- Chapter 16 Flashcards (202)
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why should barbers study women', 'To expand client base, increase financial earnings, apply men', 'introduction', 'medium', 0);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What percentage of barbershop clients are typically women?', 'Women represent a growing segment - many barbershops report 20-40% female clientele', 'introduction', 'medium', 1);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How can men', 'Clipper work, fading, and precision techniques from men', 'introduction', 'medium', 2);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the main difference in client expectations between men', 'Women typically expect more styling guidance, product recommendations, and finishing techniques', 'introduction', 'medium', 3);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What opportunity does women', 'Higher ticket services, retail product sales, and building long-term client relationships', 'introduction', 'medium', 4);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the main difference in overall form between men', 'Men', 'differences', 'medium', 5);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What design element is commonly used in women', 'Curved design lines and feathering techniques for softer edges', 'differences', 'medium', 6);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do styling requirements differ between men', 'Women', 'differences', 'medium', 7);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How does length manipulation differ in women', 'Women', 'differences', 'medium', 8);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is feathering in women', 'A technique that creates soft, wispy ends by cutting hair at a slight angle with a sliding motion', 'differences', 'medium', 9);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why are curved design lines important in women', 'They create softness, movement, and feminine shapes that complement facial features', 'differences', 'medium', 10);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the ideal hair condition before cutting women', 'Clean, conditioned hair that is damp (not soaking wet)', 'reminders', 'medium', 11);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why is head position important in women', 'Head position affects the natural fall and distribution of hair, impacting the final shape', 'reminders', 'medium', 12);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the proper body position for cutting women', 'Stand with good posture, feet shoulder-width apart, positioned to maintain control and ergonomics', 'reminders', 'medium', 13);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Where should fingers be placed when cutting?', 'Fingers should be placed to control the hair section while keeping them visible and safe from the blade', 'reminders', 'medium', 14);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why are clean partings important?', 'Clean partings ensure even distribution, accurate sectioning, and precise cutting', 'reminders', 'medium', 15);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why should hair be kept damp during cutting?', 'Damp hair allows for even tension, accurate cutting, and predictable results', 'reminders', 'medium', 16);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the importance of working with natural growth patterns?', 'Working with growth patterns ensures the cut lays properly and styles easily for the client', 'reminders', 'medium', 17);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should tension be controlled when cutting?', 'Maintain consistent, moderate tension - too tight stretches hair and causes uneven cuts; too loose creates uneven sections', 'reminders', 'medium', 18);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is cross-checking and why is it important?', 'Checking the haircut from multiple angles to ensure balance, evenness, and proper shape', 'reminders', 'medium', 19);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should mirrors be used during cutting?', 'Use mirrors to show progress, check balance, and help clients visualize the developing shape', 'reminders', 'medium', 20);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the shrinkage factor in haircutting?', 'The amount hair contracts when drying - important when cutting curly or wavy hair', 'reminders', 'medium', 21);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How much can curly hair shrink when dry?', 'Curly hair can shrink 25-75% of its wet length depending on curl pattern', 'reminders', 'medium', 22);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a blunt cut?', 'A one-length cut where all hair is cut to the same length with no elevation (0 degrees)', 'basic-cuts', 'medium', 23);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What elevation is used for a blunt cut?', '0 degrees - hair is held straight down with no elevation', 'basic-cuts', 'medium', 24);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the weight line in a blunt cut?', 'A heavy, solid weight line at the perimeter created by cutting all hair to one length', 'basic-cuts', 'medium', 25);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Can blunt cuts use diagonal lines?', 'Yes - blunt cuts can be cut on horizontal or diagonal lines (A-line, diagonal forward/back)', 'basic-cuts', 'medium', 26);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a graduated cut?', 'A cut with stacked layers that build weight at the perimeter, cut at 45-degree elevation', 'basic-cuts', 'medium', 27);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What elevation is used for a graduated cut?', '45 degrees - creates a wedge or stacked shape with weight at the bottom', 'basic-cuts', 'medium', 28);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What shape does a graduated cut create?', 'A wedge or stacked shape with graduated layers building weight at the perimeter', 'basic-cuts', 'medium', 29);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a uniform-layered cut?', 'A cut where all strands are cut to the same length at 90-degree elevation using a traveling guide', 'basic-cuts', 'medium', 30);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What elevation is used for a uniform-layered cut?', '90 degrees - hair is held straight out from the head', 'basic-cuts', 'medium', 31);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a traveling guide in haircutting?', 'A guide that moves with each section, creating uniform layers throughout the cut', 'basic-cuts', 'medium', 32);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a long-layered cut?', 'A cut with increased layering where layers are progressively longer toward the perimeter', 'basic-cuts', 'medium', 33);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What elevation is used for a long-layered cut?', '180 degrees - overdirection creates progressively longer layers', 'basic-cuts', 'medium', 34);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the difference between uniform layers and long layers?', 'Uniform layers are all the same length at 90°; long layers progressively increase in length using overdirection', 'basic-cuts', 'medium', 35);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Which basic cut creates the most volume at the crown?', 'The uniform-layered cut creates volume throughout due to equal distribution of weight', 'basic-cuts', 'medium', 36);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Which basic cut is best for fine, thin hair?', 'The blunt cut creates the appearance of thicker, fuller hair', 'basic-cuts', 'medium', 37);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the three hair textures?', 'Fine, Medium, and Coarse', 'texture-density', 'medium', 38);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What does fine hair refer to?', 'The diameter of individual strands - fine hair has a small diameter', 'texture-density', 'medium', 39);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What does coarse hair refer to?', 'The diameter of individual strands - coarse hair has a large diameter', 'texture-density', 'medium', 40);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the three hair densities?', 'Thin, Medium, and Thick', 'texture-density', 'medium', 41);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the difference between texture and density?', 'Texture refers to strand diameter; density refers to the number of hairs per square inch', 'texture-density', 'medium', 42);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How does fine, thin hair affect cutting choices?', 'Avoid over-layering; blunt cuts work best; be careful with texturizing', 'texture-density', 'medium', 43);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How does coarse, thick hair affect cutting choices?', 'May need texturizing to remove bulk; layers help with manageability', 'texture-density', 'medium', 44);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What cut is best for fine, thick hair?', 'Layered cuts can add movement; graduated cuts create the illusion of fullness', 'texture-density', 'medium', 45);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What cut is best for coarse, thin hair?', 'Blunt cuts with minimal layering to preserve density appearance', 'texture-density', 'medium', 46);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How does texture affect the choice of cutting tools?', 'Coarse hair may need sharper shears; fine hair requires precise, clean cuts', 'texture-density', 'medium', 47);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the two parts of a wave formation?', 'The trough (valley) and the crest (peak)', 'curly', 'medium', 48);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the trough of a wave?', 'The valley or lowest point between two crests in a wave pattern', 'curly', 'medium', 49);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the crest of a wave?', 'The peak or highest point of a wave', 'curly', 'medium', 50);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What happens when you cut curly hair at the crest?', 'The ends tend to flip outward, creating more volume', 'curly', 'medium', 51);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What happens when you cut curly hair in the trough?', 'The ends may flip inward, creating a softer edge', 'curly', 'medium', 52);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Should curly hair be cut wet or dry?', 'Often cut dry or in natural state to see true length and curl pattern', 'curly', 'medium', 53);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why is shrinkage important when cutting curly hair?', 'Curly hair can shrink significantly when dry, so cuts must account for this', 'curly', 'medium', 54);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How often do curly hair clients typically need maintenance cuts?', 'Every 4-6 weeks to maintain shape and remove split ends', 'curly', 'medium', 55);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What technique helps maintain curl definition when cutting?', 'Cutting curl by curl in its natural clump pattern', 'curly', 'medium', 56);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Can clippers be used on curly hair?', 'Yes, but use with caution - work with the curl pattern and use appropriate guards', 'curly', 'medium', 57);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the best approach for cutting natural curly styles?', 'Cut hair in its natural, dry state to see the true curl pattern and length', 'curly', 'medium', 58);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is overdirection in haircutting?', 'Combing hair away from its natural fall position to increase length in a specific area', 'techniques', 'medium', 59);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What effect does overdirection create?', 'Increases length in the opposite direction of the overdirection', 'techniques', 'medium', 60);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is razor cutting?', 'Using a razor tool to cut hair, producing softer, more textured ends', 'techniques', 'medium', 61);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'When should razor cutting be performed?', 'On damp hair - the hair must be wet for the razor to glide smoothly', 'techniques', 'medium', 62);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of shapes does razor cutting produce?', 'Softer, more diffused shapes with textured, wispy ends', 'techniques', 'medium', 63);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is texturizing in haircutting?', 'Techniques used to remove bulk, add volume, or create movement in the hair', 'techniques', 'medium', 64);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'When is texturizing used?', 'To remove excess bulk, add volume, create movement, or soften hard lines', 'techniques', 'medium', 65);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the key control for determining weight vs. layering?', 'Elevation - higher elevation creates more layering; lower elevation maintains weight', 'techniques', 'medium', 66);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is point cutting?', 'A texturizing technique where the tips of the shears are held at a steep angle to the hair', 'texturizing', 'medium', 67);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What effect does point cutting create?', 'Soft, blended ends with a diffused edge', 'texturizing', 'medium', 68);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is notching?', 'A texturizing technique where shears are held at a flatter angle, creating a chunkier effect', 'texturizing', 'medium', 69);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the difference between point cutting and notching?', 'Point cutting uses a steep angle for soft effects; notching uses a flatter angle for chunkier removal', 'texturizing', 'medium', 70);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is freehand notching?', 'Notching performed on interior sections without using a guide or sectioning', 'texturizing', 'medium', 71);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is slithering?', 'A texturizing technique that thins hair to graduated lengths by sliding partially open shears', 'texturizing', 'medium', 72);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How is slithering performed?', 'By sliding partially open shears along the hair shaft to remove weight gradually', 'texturizing', 'medium', 73);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is slicing in haircutting?', 'A technique where blades are kept open near the pivot to remove weight in specific areas', 'texturizing', 'medium', 74);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'When is slicing used?', 'To remove bulk and create separation in specific areas without affecting overall length', 'texturizing', 'medium', 75);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is carving in haircutting?', 'A texturizing technique using an open-and-closing movement to create separation and texture', 'texturizing', 'medium', 76);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What effect does carving create?', 'Creates separation, texture, and piece-y definition in the hair', 'texturizing', 'medium', 77);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Which texturizing technique is best for removing bulk from thick hair?', 'Slithering or slicing are effective for removing bulk while maintaining length', 'texturizing', 'medium', 78);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the three main hairstyling categories?', 'Wet hairstyling, natural dry styling, and thermal styling', 'styling', 'medium', 79);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is wet hairstyling?', 'Styling techniques performed on wet hair including finger waving, pin curls, and roller sets', 'styling', 'medium', 80);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is finger waving?', 'A wet styling technique creating S-shaped waves using fingers and comb', 'styling', 'medium', 81);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are pin curls?', 'Small sections of hair curled and pinned to the scalp to create curls or waves', 'styling', 'medium', 82);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a roller set?', 'Using rollers on wet hair to create volume, curls, or waves when dried', 'styling', 'medium', 83);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is natural dry styling?', 'Styling techniques that work with the hair', 'styling', 'medium', 84);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is hair wrapping?', 'A technique to keep curly hair smooth and straight by wrapping around the head', 'styling', 'medium', 85);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is hair molding?', 'Combing hair straight down, drying it in place, then finishing with thermal tools', 'styling', 'medium', 86);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is blowdry styling?', 'Drying and styling hair in one step using a blow dryer and brush', 'styling', 'medium', 87);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the benefits of blowdry styling?', 'Combines drying and styling for efficiency; creates smooth, voluminous finishes', 'styling', 'medium', 88);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is thermal waving?', 'Creating curls or waves using heated tools like Marcel irons or curling irons', 'thermal', 'medium', 89);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the difference between Marcel irons and curling irons?', 'Marcel irons have a manual clamp and are used by professionals; curling irons have a spring-loaded clamp', 'thermal', 'medium', 90);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the three parts of a curl?', 'The base, the stem, and the circle (or curl)', 'thermal', 'medium', 91);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the base of a curl?', 'The stationary foundation where the curl begins, closest to the scalp', 'thermal', 'medium', 92);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the stem of a curl?', 'The section between the base and the circle that determines the curl', 'thermal', 'medium', 93);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the circle of a curl?', 'The coiled or looped part of the curl that forms the visible wave or curl pattern', 'thermal', 'medium', 94);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is an on-base roller placement?', 'The base is lifted to 135 degrees, creating maximum volume at the base', 'thermal', 'medium', 95);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a half off-base roller placement?', 'The base is held at 90 degrees, creating moderate volume', 'thermal', 'medium', 96);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is an off-base roller placement?', 'The base is held below 90 degrees, creating the least volume and a smooth base', 'thermal', 'medium', 97);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is thermal straightening (hair pressing)?', 'Using a heated pressing comb to temporarily straighten curly or coily hair', 'thermal', 'medium', 98);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the three types of hair pressing?', 'Soft press, medium press, and hard press', 'thermal', 'medium', 99);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a soft press?', 'Light pressing that removes 50-60% of curl; hair returns to curly state quickly', 'thermal', 'medium', 100);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a medium press?', 'Moderate pressing that removes 60-75% of curl; lasts longer than soft press', 'thermal', 'medium', 101);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is a hard press?', 'Heavy pressing that removes most curl; hair is very straight but more susceptible to heat damage', 'thermal', 'medium', 102);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What safety precautions are needed for thermal tools?', 'Test temperature, use thermal protectant, avoid overheating, and never use on damp hair', 'thermal', 'medium', 103);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What do flat irons do?', 'Temporarily straighten hair by applying heat between two heated plates', 'thermal', 'medium', 104);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What sizes do flat irons come in?', 'Various plate widths typically from 1/2 inch to 2 inches', 'thermal', 'medium', 105);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'When should flat irons be used?', 'Only on clean, completely dry hair', 'thermal', 'medium', 106);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why should leave-in thermal products be used with flat irons?', 'To protect hair from heat damage and help the style last longer', 'thermal', 'medium', 107);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you test flat iron temperature?', 'Using a moist tissue - it should sizzle but not scorch immediately', 'thermal', 'medium', 108);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What temperature range is typical for flat irons?', '250°F to 450°F depending on hair type and condition', 'thermal', 'medium', 109);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What hair types need lower flat iron temperatures?', 'Fine, damaged, or color-treated hair needs lower temperatures (250-300°F)', 'thermal', 'medium', 110);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What hair types can tolerate higher flat iron temperatures?', 'Coarse, resistant, or healthy hair can use higher temperatures (350-450°F)', 'thermal', 'medium', 111);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What are the preparation steps for women', 'Consultation, drape client, sanitize tools, cleanse hair if needed, and detangle', 'procedures', 'medium', 112);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the standard sectioning pattern for haircuts?', 'Seven sections: top, two sides, two back quadrants, and two nape sections', 'procedures', 'medium', 113);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the first step in Procedure 16-1: Blunt Cut?', 'Perform consultation and hair analysis', 'procedures', 'medium', 114);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the elevation for Procedure 16-1: Blunt Cut?', '0 degrees - no elevation', 'procedures', 'medium', 115);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the first step in Procedure 16-2: Graduated Cut?', 'Perform consultation and determine the desired shape', 'procedures', 'medium', 116);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the elevation for Procedure 16-2: Graduated Cut?', '45 degrees', 'procedures', 'medium', 117);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What shape does Procedure 16-2: Graduated Cut create?', 'A wedge or stacked shape with weight at the perimeter', 'procedures', 'medium', 118);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the first step in Procedure 16-3: Uniform-Layered Cut?', 'Perform consultation and determine layer length', 'procedures', 'medium', 119);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the elevation for Procedure 16-3: Uniform-Layered Cut?', '90 degrees', 'procedures', 'medium', 120);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of guide is used in Procedure 16-3: Uniform-Layered Cut?', 'A traveling guide', 'procedures', 'medium', 121);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the final step in all haircutting procedures?', 'Clean up, style as desired, and disinfect tools and station', 'procedures', 'medium', 122);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why is cross-checking important at the end of a procedure?', 'To ensure evenness, balance, and that the desired shape has been achieved', 'procedures', 'medium', 123);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'In Procedure 16-3 Step 6, where do you start the uniform-layered cut?', 'At the nape, elevating hair to 90 degrees', 'detailed-procedures', 'medium', 124);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How much hair is cut in Step 6 of Procedure 16-3?', 'Cut 3 inches following the head shape', 'detailed-procedures', 'medium', 125);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'In Procedure 16-3, when should you switch hand position?', 'Above the occipital bone', 'detailed-procedures', 'medium', 126);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Why switch hand position above the occipital in Procedure 16-3?', 'To avoid creating corners in the cut', 'detailed-procedures', 'medium', 127);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'In Procedure 16-3, how far should you cut when above the occipital?', 'Cut to the second knuckle', 'detailed-procedures', 'medium', 128);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What sectioning pattern is used after the nape in Procedure 16-3?', 'A horseshoe section from recession to recession below the crown', 'detailed-procedures', 'medium', 129);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of parting is used from occipital to back of ear in Procedure 16-3?', 'Horizontal parting', 'detailed-procedures', 'medium', 130);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of parting follows the horizontal parting in Procedure 16-3?', 'Slight diagonal forward parting through to the nape', 'detailed-procedures', 'medium', 131);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'At what elevation is hair held for the diagonal forward parting in Procedure 16-3?', '90 degrees', 'detailed-procedures', 'medium', 132);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should you cut when using diagonal forward parting in Procedure 16-3?', 'Cut parallel to the parting', 'detailed-procedures', 'medium', 133);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How often should you cross-check in Procedure 16-3?', 'Horizontally on every fourth section', 'detailed-procedures', 'medium', 134);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What sectioning is used after releasing the horseshoe in Procedure 16-3?', 'Radial section from above crown to top of each ear', 'detailed-procedures', 'medium', 135);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of sections are used below the radial section in Procedure 16-3?', 'Pivoting wedge-shaped sections', 'detailed-procedures', 'medium', 136);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What subsections are used from the radial section to front hairline in Procedure 16-3?', 'Horizontal subsections elevated to 90 degrees', 'detailed-procedures', 'medium', 137);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How is the dry haircut performed in Procedure 16-3?', 'Using hands or paddle brush', 'detailed-procedures', 'medium', 138);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What texturizing technique is used on the interior in Procedure 16-3?', 'Deep point cutting', 'detailed-procedures', 'medium', 139);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is the first sectioning step in Procedure 16-4?', 'Central profile parting from front hairline to nape', 'detailed-procedures', 'medium', 140);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How wide are the diagonal forward subsections in Procedure 16-4?', '½ inch wide', 'detailed-procedures', 'medium', 141);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Where do the first diagonal forward subsections extend in Procedure 16-4?', 'From occipital to behind the ear', 'detailed-procedures', 'medium', 142);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What head position is used when cutting the perimeter guide in Procedure 16-4?', 'Tilt head slightly forward', 'detailed-procedures', 'medium', 143);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'At what elevation is hair combed for the perimeter guide in Procedure 16-4?', '0 degrees to natural fall', 'detailed-procedures', 'medium', 144);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should the cut line relate to the parting in Procedure 16-4?', 'Cut line parallel to the parting', 'detailed-procedures', 'medium', 145);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What section is created from below crown to front hairline in Procedure 16-4?', 'Horseshoe section', 'detailed-procedures', 'medium', 146);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How is hair on the sides handled in Procedure 16-4?', 'Combed to natural fall, overdirected behind shoulder, cut square to guide', 'detailed-procedures', 'medium', 147);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of parting is used from profile to top of ear in Procedure 16-4?', 'Diagonal back parting', 'detailed-procedures', 'medium', 148);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'At what elevation is hair held for the diagonal back parting in Procedure 16-4?', '45 degrees from the face', 'detailed-procedures', 'medium', 149);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What length is the target when cutting at 45 degrees in Procedure 16-4?', 'Chin length', 'detailed-procedures', 'medium', 150);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What area should be avoided when cutting at the sideburn?', 'Avoid cutting the corner at the sideburn area', 'detailed-procedures', 'medium', 151);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What happens to hair behind the ear in Procedure 16-4?', 'Sectioned out and won', 'detailed-procedures', 'medium', 152);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'At the front hairline, what section is used as a guide in Procedure 16-4?', '½-inch profile section to occipital using chin length as guide', 'detailed-procedures', 'medium', 153);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'At what elevation is the profile section held at the front hairline?', '90 degrees', 'detailed-procedures', 'medium', 154);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What technique is used below crown and above occipital in Procedure 16-4?', 'Diagonal back line, elevate to 90 degrees, overdirect to center stationary guide', 'detailed-procedures', 'medium', 155);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you check for proper layering in Procedure 16-4?', 'Take horizontal section at top and look for increase in length', 'detailed-procedures', 'medium', 156);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What brush is used for blowdrying in Procedure 16-4?', 'Large round brush', 'detailed-procedures', 'medium', 157);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How far from the ends should you hold hair when deep point cutting?', '3 inches from ends', 'detailed-procedures', 'medium', 158);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should you enter the hair with shears for deep point cutting?', 'Enter parallel to the hair', 'detailed-procedures', 'medium', 159);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What panel size is used when deep point cutting in Procedure 16-4?', '1-inch panels', 'detailed-procedures', 'medium', 160);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of brush is needed for hair wrapping?', 'Boar-bristle paddle brush', 'detailed-procedures', 'medium', 161);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What type of dryer is used for hair wrapping?', 'Hood dryer', 'detailed-procedures', 'medium', 162);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is used to secure wrapped hair?', 'Bobby pins and duckbill clips', 'detailed-procedures', 'medium', 163);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is stretched around the head after wrapping?', 'Neck strip or hairnet', 'detailed-procedures', 'medium', 164);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How long is hair placed under hooded dryer when wrapping?', '45 minutes to 1 hour depending on length', 'detailed-procedures', 'medium', 165);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How long should wrapped hair be left if working on dry hair?', 'About 17 minutes', 'detailed-procedures', 'medium', 166);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What determines how smooth wrapped hair will be?', 'The longer hair is wrapped, the smoother it will be', 'detailed-procedures', 'medium', 167);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What should be applied to dry hair before wrapping?', 'Light oil or styling aid', 'detailed-procedures', 'medium', 168);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should tangles be removed before wrapping?', 'With wide-tooth comb, starting at ends working up to scalp', 'detailed-procedures', 'medium', 169);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What attachment is used on the blowdryer for controlled styling?', 'Nozzle/concentrator', 'detailed-procedures', 'medium', 170);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What product is applied before blowdrying straight?', 'Light gel or straightening gel', 'detailed-procedures', 'medium', 171);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What size subsections are used when blowdrying?', '1-inch subsections', 'detailed-procedures', 'medium', 172);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'Where do you start when blowdrying straight?', 'At the nape with classic styling brush', 'detailed-procedures', 'medium', 173);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should the brush be positioned under the section?', 'Place brush under first section, hold hair low', 'detailed-procedures', 'medium', 174);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What elevation keeps the shape flat and straight?', 'Low elevation', 'detailed-procedures', 'medium', 175);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What creates more lift and volume when blowdrying?', 'Holding section straight out or overdirecting upward', 'detailed-procedures', 'medium', 176);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What button is used after each section is blown dry?', 'Cooling button to set and keep smooth', 'detailed-procedures', 'medium', 177);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What brush is used for a fuller look when blowdrying?', 'Round brush', 'detailed-procedures', 'medium', 178);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should the nozzle face when blowdrying sides?', 'Toward the ends', 'detailed-procedures', 'medium', 179);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you create a rounded edge when blowdrying?', 'Turn brush under', 'detailed-procedures', 'medium', 180);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you create a flipped edge when blowdrying?', 'Turn brush outward', 'detailed-procedures', 'medium', 181);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should the nozzle be positioned when drying bangs?', 'Point nozzle down over bang', 'detailed-procedures', 'medium', 182);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you direct bang away from the face?', 'Brush bang back, push hair slightly forward with brush, use slow setting', 'detailed-procedures', 'medium', 183);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What tool is heated for hair pressing?', 'Pressing comb', 'detailed-procedures', 'medium', 184);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What products are applied before pressing?', 'Pressing cream, wax, or oil', 'detailed-procedures', 'medium', 185);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How many sections is hair parted into for pressing?', 'Four sections', 'detailed-procedures', 'medium', 186);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you test pressing comb temperature?', 'Using paper neck strip or end paper', 'detailed-procedures', 'medium', 187);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What indicates the pressing comb is too hot?', 'If paper scorches', 'detailed-procedures', 'medium', 188);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What size subsections are used for pressing?', '1-inch subsections', 'detailed-procedures', 'medium', 189);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How is the comb positioned when pressing?', 'Insert teeth into top side of hair section', 'detailed-procedures', 'medium', 190);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What part of the comb does the actual pressing?', 'The back of the comb', 'detailed-procedures', 'medium', 191);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should the comb move through the hair?', 'Slowly through hair until ends pass through teeth', 'detailed-procedures', 'medium', 192);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What can be added after pressing if desired?', 'Pomade', 'detailed-procedures', 'medium', 193);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What product is applied before flat iron pressing?', 'Leave-in thermal styling spray', 'detailed-procedures', 'medium', 194);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How are subsections sized for flat ironing?', 'Based on hair density', 'detailed-procedures', 'medium', 195);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you test flat iron temperature?', 'Using paper neck strip or end paper', 'detailed-procedures', 'medium', 196);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How is the subsection held during flat ironing?', 'Away from scalp, grasped between plates of flat iron', 'detailed-procedures', 'medium', 197);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What protects the scalp during flat ironing?', 'Insert comb under top side of hair section', 'detailed-procedures', 'medium', 198);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How should the iron move through the hair?', 'Smoothly through subsection', 'detailed-procedures', 'medium', 199);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'How do you increase lift in top sections when flat ironing?', 'Comb and elevate subsection before ironing', 'detailed-procedures', 'medium', 200);
INSERT INTO flashcards (chapter_id, front, back, category, difficulty, order_index)
VALUES ((SELECT id FROM chapters WHERE chapter_number = 16), 'What is used to finish after flat ironing?', 'Styling spray', 'detailed-procedures', 'medium', 201);
