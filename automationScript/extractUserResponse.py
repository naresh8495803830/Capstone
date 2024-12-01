import pymongo
import pandas as pd

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://shrikarlonkar:wYkbmyFIj9iRDmPe@cluster0.gp5lvzy.mongodb.net")
db = client['npsherovired']  # replace with your database name

# Access collections
npsresponses_collection = db['npsresponses']
students_collection = db['students']
batches_collection = db['batches']

# Fetch data from collections
npsresponses = list(npsresponses_collection.find())
students = list(students_collection.find())
batches = list(batches_collection.find())

# Convert ObjectId to string for merging
for doc in npsresponses:
    doc['_id'] = str(doc['_id'])
    doc['studentId'] = str(doc['studentId'])
    doc['batchId'] = str(doc['batchId'])

for doc in students:
    doc['_id'] = str(doc['_id'])

for doc in batches:
    doc['_id'] = str(doc['_id'])

# Convert fetched data to DataFrame
npsresponses_df = pd.DataFrame(npsresponses)
students_df = pd.DataFrame(students)
batches_df = pd.DataFrame(batches)

# Merge dataframes to get required information
merged_df = pd.merge(npsresponses_df, students_df, left_on='studentId', right_on='_id', how='left')
merged_df = pd.merge(merged_df, batches_df, left_on='batchId', right_on='_id', how='left')

# Add URL prefix to responseCode
merged_df['responseCode'] = 'https://nps.herovired.com/npsresponse/' + merged_df['responseCode']

# Select and rename columns
result_df = merged_df[[
    'name',
    'email',
    'phoneNo',
    'batchName',
    'responseCode',
    'completionStatus'
]]

# Save to CSV
result_df.to_csv('nps_responses.csv', index=False)

print("Data extracted and saved to nps_responses.csv")
