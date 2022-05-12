import requests
import MySQLdb
import time
from bs4 import BeautifulSoup
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="quotedb",
    user="postgres",
    password="")

cursor = conn.cursor()


#URL to be scraped
url_to_scrape = 'https://en.wikiquote.org/wiki/Category:Lists_of_people'
#Load html's plain data into a variable
plain_html_text = requests.get(url_to_scrape)
#parse the data
soup0 = BeautifulSoup(plain_html_text.text, "html.parser")

categoryDivs = soup0.findAll("div", {"class": "mw-category-group"})
catNumbers = range(1,18,1)
categoryLinks = []

for cat in catNumbers:
	for a in categoryDivs[cat].findAll('a'):
		categoryLinks.append(a.get('href'))

#print(categoryLinks)

peopleLinks = []

for cat in categoryLinks:
	url_to_scrape = 'https://en.wikiquote.org' + cat
	print(url_to_scrape)
	plain_html_text = requests.get(url_to_scrape)
	soup1 = BeautifulSoup(plain_html_text.text, "html.parser")
	soup2 = soup1.findAll("div", {"class": "mw-parser-output"})
	soup3 = soup2[0].findAll("li")
	for text in soup3:
		try:
			for a in text.findAll('a'):
				if ("/wiki/" in a.get('href')):
					peopleLinks.append(a.get('href'))
		except:
			print("Ongelmia tekstissa")
	time.sleep(0.1)

numberOfPeople = len(peopleLinks)
peopleIndices = [1847,2255,2752,3573,4001,4762,5000,5487,5488,7916,9436]

file1 = open('Quotet2.txt', 'w')

#for peopleIndex in range(1,numberOfPeople-1):
for peopleIndex in peopleIndices:

	try:
		url_to_scrape = 'https://en.wikiquote.org' + peopleLinks[peopleIndex]
		print(url_to_scrape)
		plain_html_text = requests.get(url_to_scrape)
		soup1 = BeautifulSoup(plain_html_text.text, "html.parser")
		soup2 = soup1.findAll("div", {"class": "mw-parser-output"})

		children = soup2[0].findChildren(recursive=False)
		numberOfChildren = len(children)

		headerIndexes = []
		headers = []
		quoteIndexes = []
		quoteULs = []
		quoteStartIndex = []

		for index in range(numberOfChildren-1):
			if ("h2" in children[index].name):
				headers.append(children[index])
				headerIndexes.append(index)
				if ('Quotes' in headers[len(headers)-1].text):
					quoteStartIndex.append(index)

		for index in range(numberOfChildren-1):
			if ("ul" in children[index].name):
				quoteULs.append(children[index])
				quoteIndexes.append(index)

		if (len(quoteStartIndex) == 0):
			continue
		xx = headerIndexes.index(quoteStartIndex[0])

		startIndex = next(x for x in quoteIndexes if x > quoteStartIndex[0])

		if (len(headerIndexes) != 1):
			endIndex = next((x for x in reversed(quoteIndexes) if x < headerIndexes[xx+1]))
		else:
			endIndex = quoteIndexes[len(quoteIndexes)-1]

		finalIndexes = []

		for index in range(numberOfChildren-1):
			if (index in quoteIndexes and index < endIndex):
				finalIndexes.append(index)

		quotes = []
		for index in finalIndexes:
			quote = children[index].find('li')
			quoteText = quote.text
			endIndex = quoteText.find('\n')
			quotes.append(quoteText[:endIndex])

			sql = "INSERT INTO quote(user_id, quotephrase, said_by, likes) VALUES (1, '" + quoteText[:endIndex] + "', '" + peopleLinks[peopleIndex] + "', 0)"
			try:
				# Execute the SQL command
				cursor.execute(sql)
				# Commit your changes in the database
				conn.commit()

			except:
				# Rollback in case there is any error
				conn.rollback()


		#file1 = open('myfile.txt', 'w')
		#file1.write('\n')
		#file1.write(peopleLinks[peopleIndex])
		#file1.write('\n')
		#for q in quotes:
		#	file1.writelines(q)
		#	file1.write('\n')
		time.sleep(0.05)
	except:
		print("Exception tapahtui")

#sql4 = "INSERT INTO role(role_name) VALUES ('moderator')"
##try:
## Execute the SQL command
#cursor.execute(sql4)
## Commit your changes in the database
#conn.commit()

cursor.close()
conn.close()



#file1.close()

