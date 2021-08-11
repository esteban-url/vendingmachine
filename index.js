const { exit } = require('process')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const readLineAsync = async (message) => {
  return new Promise((resolve, reject) => {
    readline.question(message, (answer) => {
      resolve(answer)
    })
  })
}
const defaultConfig = {
  depositBox: [
    { coin: '🟠 1 Credit', value: 1, quantity: 25 },
    { coin: '🟡 2 Credits', value: 2, quantity: 20 },
    { coin: '🟢 5 Credits', value: 5, quantity: 10 },
    { coin: '🔵 10 Credits', value: 10, quantity: 5 },
  ],
  products: [
    { name: '🍎 Apple', code: 'a1', price: 50, quantity: 5 },
    { name: '🍊 Orange', code: 'o1', price: 5, quantity: 5 },
    { name: '🍉 Watermelon', code: 'w1', price: 10, quantity: 5 },
    { name: '🍓 Strawberry', code: 's1', price: 12, quantity: 5 },
    { name: '🥝 Kiwi ', code: 'k1', price: 15, quantity: 5 },
    { name: '🍑 Peach', code: 'p1', price: 20, quantity: 1 },
  ],
}
const printHR = () => console.info('\n--------------------------------------\n')
const print = (msg) => console.info(msg)

const main = async () => {
  const state = { products: [], depositBox: [] }

  const printProducts = (filter_func, desc) => {
    printHR()
    print(`🧺 Products${desc ? ' - ' + desc : ''}:`)
    print('\n----------------CODE----PRICE---QTY---\n')

    if (typeof filter_func === 'function') {
      defaultConfig.products.filter(filter_func).map((item) => {
        print(
          `${item.name}\t#️⃣ ${item.code}\t💸 ${item.price}\t🧮 ${item.quantity}`
        )
      })
    } else {
      defaultConfig.products.map((item) => {
        print(
          `${item.name}\t#️⃣  ${item.code}\t💸 ${item.price}\t🧮 ${item.quantity}`
        )
      })
    }
  }

  const printDepositBox = () => {
    printHR()
    print('💰 Deposit Box:')
    printHR()

    defaultConfig.depositBox.map((item) => {
      print(`${item.coin}:\t${item.quantity} coins`)
    })
  }

  const init = async () => {
    printHR()
    print('🚀 Starting Vending Machine')
    printHR()
    print('This is the default configuration of\nthe machine:')
    printProducts()
    printDepositBox()

    await defaultConfigConfirm()
  }

  const defaultConfigConfirm = async () => {
    printHR()
    const useDefaultConfig = await readLineAsync(
      'Are you ok with this machine? (y/n): '
    )
    switch (useDefaultConfig) {
      case 'y':
      case 'Y':
      case 'yes':
      case 'YES':
        state.products = [...defaultConfig.products]
        state.depositBox = [...defaultConfig.depositBox]
        printHR()
        print('😎 Starting up...')

        break
      case 'n':
      case 'N':
      case 'no':
      case 'NO':
        loadIn()

        break
      default:
        print('Plase enter a valid option.')
        print(
          "😞 Sorry, can't understand that. Please select a valid option. (y/n)"
        )
        printHR()
        defaultConfigConfirm()
        break
    }
  }

  const loadIn = async () => {
    printHR()
    print('🚚 Load the products in the machine!')
    //products
    for (let i = 0; i < 6; i++) {
      printHR()
      print('Product ' + (i + 1))
      printHR()
      const name = await readLineAsync('Name: ')
      const code = await readLineAsync('Code: ')
      const price = await readLineAsync('Price: ')
      const quantity = await readLineAsync('Quantity: ')
      state.products.push({ name, code, quantity, price })
    }
    printHR()
    print('💸 Load the deposit box!')
    printHR()
    const one = await readLineAsync('🟠 1 Credit coins: ')
    printHR()
    const two = await readLineAsync('🟡 2 Credits coins: ')
    printHR()
    const five = await readLineAsync('🟢 5 Credits coins: ')
    printHR()
    const ten = await readLineAsync('🔵 10 Credits coins: ')

    state.depositBox.push({ coin: '🟠 1 Credit', value: 1, quantity: one })
    state.depositBox.push({ coin: '🟡 2 Credits', value: 2, quantity: two })
    state.depositBox.push({ coin: '🟢 5 Credits', value: 5, quantity: five })
    state.depositBox.push({ coin: '🔵 10 Credits', value: 10, quantity: ten })
    printHR()
    print('🎉 Loading complete! 🎉')
    print('Here is what the machine look like now:')
    printHR()
  }

  const mainMenu = async () => {
    printHR()
    print('🙋 Welcome!')
    printHR()
    print('1️⃣ Display inventory')
    print('2️⃣ Purchase a product')
    print('3️⃣ Display Deposit box')
    print('❌ Exit (x) ')
    printHR()
    const option = await readLineAsync('Please select an option: ')
    switch (option) {
      case '1':
        printProducts()
        await readLineAsync('press enter to continue ')
        mainMenu()
        break
      case '2':
        printHR()
        await purchase()
        mainMenu()
        break
      case '3':
        printDepositBox()
        await readLineAsync('press enter to continue ')
        mainMenu()
        break
      case 'x':
        exit()
      default:
        printHR()
        print("😞 Sorry, can't understand that. Please select a valid option.")
        mainMenu()
        break
    }
  }

  const getCoins = () => {
    return [
      state.depositBox.find((x) => x.value === 10),
      state.depositBox.find((x) => x.value === 5),
      state.depositBox.find((x) => x.value === 2),
      state.depositBox.find((x) => x.value === 1),
    ]
  }

  const addCoins = async (ten = 0, five = 0, two = 0, one = 0) => {
    const [tens, fives, twos, ones] = getCoins()
    tens.quantity = tens.quantity + ten
    fives.quantity = fives.quantity + five
    twos.quantity = twos.quantity + two
    ones.quantity = ones.quantity + one
    printDepositBox()
  }

  const returnCoins = async (amount) => {
    if (amount === 0) return
    print('Here is your change: ' + amount + ' credits')

    const [db_tens, db_fives, db_twos, db_ones] = getCoins()
    var remainer_10 = 0
    var remainer_5 = 0
    var remainer_2 = 0
    var tens = 0
    var fives = 0
    var twos = 0
    var ones = 0

    if (amount >= 10) {
      remainer_10 = amount % 10
      tens = (amount - remainer_10) / 10
      if (db_tens.quantity >= tens) {
        db_tens.quantity = db_tens.quantity - tens
        amount = amount - tens * 10
      } else {
        tens = db_tens.quantity
        amount = amount - tens * 10
      }
    }
    if (amount >= 5) {
      remainer_5 = amount % 5
      fives = (amount - remainer_5) / 5
      if (db_fives.quantity >= fives) {
        db_fives.quantity = db_fives.quantity - fives
        amount = amount - fives * 5
      } else {
        fives = db_fives.quantity
        amount = amount - fives * 5
      }
    }

    if (amount >= 2) {
      remainer_2 = amount % 2
      twos = (amount - remainer_2) / 2
      if (db_twos.quantity >= twos) {
        db_twos.quantity = db_twos.quantity - twos
        amount = amount - twos * 2
      } else {
        twos = db_twos.quantity
        amount = amount - twos * 2
      }
    }
    db_ones.quantity = db_ones.quantity - remainer_2
    ones = remainer_2

    printHR()
    console.log(`${db_ones.coin}:\t${ones} coins`)
    console.log(`${db_twos.coin}:\t${twos} coins`)
    console.log(`${db_fives.coin}:\t${fives} coins`)
    console.log(`${db_tens.coin}:\t${tens} coins`)
    return [tens, fives, twos, ones]
  }

  const purchase = async () => {
    print('Please enter the quantiy of coins of\n each denomination')
    printHR()
    const ten = Number(await readLineAsync('🔵 10 Credits coins: '))
    const five = Number(await readLineAsync('🟢 5 Credits coins: '))
    const two = Number(await readLineAsync('🟡 2 Credits coins: '))
    const one = Number(await readLineAsync('🟠 1 Credit coins: '))
    const total = ten * 10 + five * 5 + two * 2 + one
    printHR()
    addCoins(ten, five, two, one)
    print('Total credits: ' + total)
    printHR()
    printProducts((x) => x.price <= total, `Under ${total} credits`)
    const code = await readLineAsync('Enter the code of the product you want: ')
    const product = state.products.find((x) => x.code === code)
    if (!product) {
      printHR()
      print('🙅 there are no products with that code')
      printHR()
      returnCoins(total)
    } else if (product.quantity === 0) {
      printHR()
      print('Sorry, we ran out of ' + product.name)
      printHR()
      returnCoins(total)
    } else if (product.price <= total) {
      product.quantity--
      print('thanks here is your ' + product.name)

      returnCoins(total - product.price)
    } else {
      printHR()
      print('🙅 Not enough credits please add more')
      printHR()
      returnCoins(total)
    }
  }
  await init()
  mainMenu()
}

main()
