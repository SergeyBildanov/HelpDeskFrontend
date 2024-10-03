import Column from "../Column";

beforeAll(() => {
  document.body.innerHTML = `<<div class="column">
      <h1 class="column-title">Todo</h1>
      <ul class="list">
        
      </ul>
      <div class="add-block hidden">
        <form class="form">
          <textarea class="text" name="todo" id="todo"></textarea>
          <div class="btns">
            <button class="add-btn">Add Card</button>
            <svg class="close-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"></path>
            </svg>
          </div>
        </form>
      </div>
      <div class="link-block">
        <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
        </svg>
        <a class="link-text" href="#">Add another card</a>
      </div>
    </div>`;
});

jest.setTimeout(30000);
describe("Popover work", () => {
  test("Popover adding", async () => {
    const column = document.querySelector(".column");
    const columnObject = new Column(column);
    setTimeout(() => {
      expect(columnObject._cards.length).toBe(0);
    }, 1000);
  });
});
