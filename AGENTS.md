# Repository Guidelines

## Development Workflow
- 코드나 설정을 수정한 뒤에는 작업을 끝내기 전에 반드시 MCP 도구를 사용해 수정한 부분의 동작을 확인하는 테스트를 수행한다.
- UI를 수정한 경우에는 수정 후 반드시 Playwright MCP를 사용해 실제 화면 동작 또는 렌더링을 확인한다.
- UI 외 변경도 가능하면 변경 지점에 가장 가까운 MCP 검증 수단을 사용한다. 예: 파일/설정 변경은 filesystem MCP 확인, 문서화된 명령 검증은 실행 결과 점검.
- 최종 보고에는 무엇을 MCP로 확인했는지와 확인 결과를 간단히 포함한다.
