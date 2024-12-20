# Generated by Django 5.1.2 on 2024-11-19 16:59

from django.db import migrations

def add_questions(apps, schema_editor):
    Question = apps.get_model('core', 'Question')

    # List of questions to add
    questions = [
        "Do you prefer light meals or hearty ones?",
        "Are you good at cooking?",
        "What flavors do you usually enjoy in your meals? (e.g., sweet, spicy, savory, tangy)",
        "Are there any ingredients you'd like to avoid or dislike?",
        "Do you have allergies?",
        "Do you have a budget range in mind for meals?",
        "How much time do you usually spend preparing meals?",
        "Are there specific nutritional goals you’re working toward (e.g., more protein, fewer carbs)?",
    ]

    # Insert questions into the database
    for text in questions:
        Question.objects.create(question=text)

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_alter_answer_questionid_alter_cookingstep_recipeid_and_more'),
    ]

    operations = [
        migrations.RunPython(add_questions),
    ]
