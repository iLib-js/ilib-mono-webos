const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Shell script execution test', () => {
    beforeAll(() => {
        console.log("!!");
        exec(`sh execute-loctool.sh`, (error, stdout, stderr) => {
            if (error) {
              done.fail(`error: ${error.message}`);
              return;
            }
            if (stderr) {
              done.fail(`stderr: ${stderr}`);
              return;
            }
          });
    });
    test("testfunction1", function() {
        //expect.assertions(1);
        console.log("testfunction 1")
        //const filePath = path.join(__dirname, 'assets/i18n/ko.json');
        const filePath = path.join(__dirname, 'data.txt');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              //done(err);
            } else {
              expect(data).toBe('Hello, Jest!\n'); // 파일 내용 확인
              //done();
            }
        });
    });
    test("testfunction2", function() {
        //expect.assertions(1);
        console.log("testfunction 2")
    });
  });