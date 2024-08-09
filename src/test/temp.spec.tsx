describe('테스트 묶음', ()=>{

  beforeEach(()=> {
    console.log('beforeEach는 각 테스트 케이스를 실행하기 전에 한번씩 실행됨')
  })

  beforeAll(()=> {
    // 두 번째에 위치해도 제일 먼저 실행됨
    console.log('모든 테스트케이스 실행 전 한번만 실행됨')
  })

  it('should be 3', ()=> {
    expect(1+2).toBe(3)
  });

  test('테스트 1', ()=> {
    expect(1+4).toEqual(5)
  })

  afterAll(()=> {
    // 두 번째에 위치해도 제일 먼저 실행됨
    console.log('모든 테스트케이스 실행 후 한번만 실행됨')
  })

  afterEach(()=> {
    console.log('afterEach는 각 테스트 케이스를 실행한 후에 한번씩 실행됨')
  })
})