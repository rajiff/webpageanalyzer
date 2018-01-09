### Metadata Extractor
- APIs
	- Submit new URL for analysis
		- Generate event about new Web Page submitted for extraction & analysis
	- Get details of all analyzed URLs
	- Get analysis details of specified URL
- Listen to event about new Web Page submitted for extraction & analysis
- Make HTTP Call to given URL
- Extract these
	- HTML Version
	- Tittle, if available
	- Was it redirected
	- HTML Document of the URL
	- Save to DB

			schema {
				URLHash : PK
				URL: <Raw or Actual URL>
				HTMLVersion
				title
				htmlDoc
				submittedOn
				analyzedOn
			}

	- Publish a event about new Web page available with Meta data extracted

### Headings Analyzer
- APIs
	- Get analysis details of specified URL
- Listen for event about new Web page available with meta data
- Read the HTML Document via JSoup for
	- Extract all headings, H1 through H6
	- Save to DB

			schema {
				URLHash : PK
				URL: <Raw or Actual URL>
				headingLevel
				headingValue
				analyzedOn
			}

### Link Analyzer
- APIs
	- Get analysis details of specified URL
#### Link Extractor
- Listen for event about new Web page available with meta data
- Read the HTML Document via JSoup or for
	- Extract all hyper links (<a> tag)
	- Publish event for each link found or extracted along with any details about it (isInternal)
#### Link ping service
- List to new Link extracted event
- Check if the link is accessible and what is the HTTP response code, if redirecting, follow the redirect and check the status of the redirection
	- Save to DB

			schema {
				URLHash : PK
				URL: <Raw or Actual URL>
				hyperLink: <complete link found>
				isInternal: true | false
				accessPath: <HTTP Response code for accessing (Redirect, ..,)>
				accessStatus: <Health of access (not reachable, healthy, ..,)>
				remarks:
				analyzedOn
			}

### Auth sensor
- APIs
	- Get analysis details of specified URL
- Listen for event about new Web page available with meta data
- Search HTML doc for few specific keywords using RegEx or JSoup
	- type='password'
	- Keywords [Signin, login]
	- OAuth redirects
- Based on what was sensed save to DB

			schema {
				URLHash : PK
				URL: <Raw or Actual URL>
				requiresLogin: true | false
				accessType: (login | Oauth | nologin | etc.,)
				analyzedOn
			}

### UI
- Form to submit a URL for analysis
- Listing view to get all analyzed URLs, paginated
	- Get list from meta data extractor
	- Use the URL hash to get details from other services for the same URLHash
		- Headings
		- Links
		- Authentication
- Collate data from all service and show a UI
