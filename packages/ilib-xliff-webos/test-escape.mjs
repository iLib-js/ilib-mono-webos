import webOSXliff from './src/webOSXliff.js';
import TranslationUnit from './src/TranslationUnit.js';

// 제어 문자(char code 129)가 포함된 문자열 생성
const textWithControlChar = "Régler" + String.fromCharCode(129);
console.log("원본 문자열:", textWithControlChar);
console.log("문자 코드:", textWithControlChar.split('').map(c => c.charCodeAt(0)));

// TranslationUnit 생성
const tu = new TranslationUnit({
    project: "test-project",
    file: "test.js",
    key: textWithControlChar,
    sourceLocale: "en-KR",
    targetLocale: "am-ET", 
    source: "To set",
    target: textWithControlChar,
    resType: "string",
    datatype: "javascript"
});

// webOSXliff 인스턴스 생성 및 직렬화
const xliff = new webOSXliff({
    version: 2.0,
    sourceLocale: "en-KR"
});

xliff.addTranslationUnit(tu);
const xml = xliff.serialize();

console.log("\n========== 직렬화된 XLIFF ==========");
console.log(xml);

// &#129;가 포함되어 있는지 확인
if (xml.includes("&#129;")) {
    console.log("\n✅ 성공: 제어 문자가 &#129;로 변환되었습니다!");
} else {
    console.log("\n❌ 실패: 제어 문자가 HTML 엔티티로 변환되지 않았습니다.");
}

// 역직렬화 테스트
console.log("\n========== 역직렬화 테스트 ==========");
const xliff2 = new webOSXliff({
    version: 2.0,
    sourceLocale: "en-KR"
});
const units = xliff2.deserialize(xml);
console.log("역직렬화된 key:", units[0].key);
console.log("원본과 동일:", units[0].key === textWithControlChar);
