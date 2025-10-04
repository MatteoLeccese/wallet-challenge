import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { WalletsService } from 'src/wallets/wallets.service';
import { CreateCustomerDto } from './interfaces/create-customer.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly walletsService: WalletsService,
  ) {}

  // Function to create a new customer and associated wallet
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Check for existing customer with same document, email, or phone
    const existing = await this.customerRepository.findOne({
      where: [
        { document: createCustomerDto.document },
        { email: createCustomerDto.email },
        { phone: createCustomerDto.phone },
      ],
    });

    // If a customer already exists, throw a conflict exception
    if (existing) {
      throw new ConflictException(
        'Customer with given document, email or phone already exists',
      );
    }

    // Create and save the new customer
    const customer = this.customerRepository.create(createCustomerDto);
    const newCustomer = await this.customerRepository.save(customer);

    // Create wallet associated with the customer
    await this.walletsService.createForCustomer(newCustomer);

    // Return the new customer
    return newCustomer;
  }

  // Function to retrieve all customers with their wallets
  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['wallet'] });
  }

  // Function to retrieve a single customer by id with their wallet
  async findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { email },
      relations: ['wallet'],
    });
  }

  async findByUniqueFields(
    email?: string,
    document?: string,
    phone?: string,
  ): Promise<Customer | null> {
    // Array of conditions to search for
    const where: any[] = [];

    // Add conditions based on provided fields
    if (email) where.push({ email });
    if (document) where.push({ document });
    if (phone) where.push({ phone });

    // If no conditions are provided, return null
    if (where.length === 0) {
      return null;
    }

    // Find and return the first matching customer
    return this.customerRepository.findOne({
      where,
    });
  }
}
