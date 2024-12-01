import pymongo
import pandas as pd

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://shrikarlonkar:wYkbmyFIj9iRDmPe@cluster0.gp5lvzy.mongodb.net")
db = client['npsherovired']  # replace with your database name

# Access collections
npsresponses_collection = db['npsresponses']
students_collection = db['students']
batches_collection = db['batches']
questions_collection = db['questions']

# Fetch data from collections
npsresponses = list(npsresponses_collection.find())
students = list(students_collection.find())
batches = list(batches_collection.find())
questions = list(questions_collection.find())

# Convert ObjectId to string for merging
for doc in npsresponses:
    doc['_id'] = str(doc['_id'])
    doc['studentId'] = str(doc['studentId'])
    doc['batchId'] = str(doc['batchId'])
    for response in doc['responses']:
        response['questionId'] = str(response['questionId'])

for doc in students:
    doc['_id'] = str(doc['_id'])

for doc in batches:
    doc['_id'] = str(doc['_id'])

for doc in questions:
    doc['_id'] = str(doc['_id'])

# Convert fetched data to DataFrame
npsresponses_df = pd.DataFrame(npsresponses)
students_df = pd.DataFrame(students)
batches_df = pd.DataFrame(batches)
questions_df = pd.DataFrame(questions)

# Extract question mappings
question_map = questions_df.set_index('_id')['question'].to_dict()

# Prepare response data
response_data = []
for response in npsresponses:
    student_info = students_df[students_df['_id'] == response['studentId']].iloc[0]
    batch_info = batches_df[batches_df['_id'] == response['batchId']].iloc[0]
    response_row = {
        'name': student_info['name'],
        'email': student_info['email'],
        'phoneNo': student_info['phoneNo'],
        'batchName': batch_info['batchName'],
        'completionStatus': response['completionStatus']
    }
    for res in response['responses']:
        question = question_map[res['questionId']]
        response_row[question] = res.get('responseVal')  # Use get to avoid KeyError
    response_data.append(response_row)

# Convert response data to DataFrame
response_df = pd.DataFrame(response_data)

# Save to CSV
response_df.to_csv('nps_responses_detailed.csv', index=False)

print("Data extracted and saved to nps_responses_detailed.csv")
