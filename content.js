let username = 'a';
let curuser = 'b';

const avatarElement = document.querySelector('.avatar');
if (avatarElement) {
  username = avatarElement.innerText;
}

const ratedUserElement = document.querySelector('.rated-user');
if (ratedUserElement) {
  curuser = ratedUserElement.innerText;
}

// Rest of your code using username and curuser

const cfaccepted = [];
let tot = 0;

const pagination = document.querySelectorAll('.page-index');

if (pagination.length > 0) {
    tot = parseInt(pagination[pagination.length - 1].innerText);
}

function accessAcceptedSubmissionIds(htmlContent) {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(htmlContent, 'text/html');
    const acceptedElements = htmlDocument.querySelectorAll('.verdict-accepted');

    for (const element of acceptedElements) {
        if (element.textContent === 'Accepted') {
            const trElement = element.closest('tr');
            const sourceLink = trElement.querySelector('.id-cell a.view-source');
            const sourceHref = sourceLink.getAttribute('href');
  
            const tdElement = trElement.querySelector('.status-small[data-problemid]'); 
            const link = tdElement.querySelector('a').getAttribute('href');   
            const problemlink = `https://codeforces.com/${link}`;
          
            
            if (tdElement) {
                const problemTitle = tdElement.textContent.trim();
                console.log('Problem Title:', problemTitle);
                const existingProblem = cfaccepted.find(item => item.problemTitle === problemTitle);

                if (!existingProblem) {
                    cfaccepted.push({
                        problem: problemlink,
                        solution: `https://codeforces.com/${sourceHref}`,
                        problemTitle
                    });
                }
            } else {
                console.log('<td> element with class "status-small" and data-problemid attribute not found.');
            }
        }
    }
}

function traverseAllPages(pageNumber) {
    fetch(`https://codeforces.com/submissions/${curuser}/page/${pageNumber}`)
        .then(response => response.text())
        .then(data => {
            accessAcceptedSubmissionIds(data);

            if (pageNumber < tot) {
                if(pageNumber+1===tot)
                openAcceptedSubmissionsPage();
                traverseAllPages(pageNumber + 1);
                
            } else {
                console.log('All pages traversed.');
            }
        })
        .catch(error => {
            console.error('Error fetching page:', error);
        });
}

function openAcceptedSubmissionsPage() {
    const newTab = window.open('', '_blank');
    newTab.document.write('<html><head><style>');
    newTab.document.write(`
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }
        
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        
        tr:nth-child(even) {
            background-color: #dddddd;
        }
    `);
    newTab.document.write('</style></head><body>');
    
    newTab.document.write('<h2>Codeforces Accepted Submissions</h2><table>');
    newTab.document.write('<tr><th>Problem</th><th>Solution</th></tr>');
    
    cfaccepted.forEach(submission => {
        newTab.document.write(`
            <tr>
                <td><a href="${submission.problem}" target="_blank">${submission.problemTitle}</a></td>
                <td><a href="${submission.solution}" target="_blank">View Solution</a></td>
            </tr>
        `);
    });
    
    newTab.document.write('</table></body></html>');
    
    newTab.document.close();
}



if (curuser === username) {
    traverseAllPages(1);
}











