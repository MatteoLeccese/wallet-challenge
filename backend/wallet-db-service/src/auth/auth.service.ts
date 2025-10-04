import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClientsService } from 'src/clients/clients.service';
import { Customer } from 'src/clients/entities/customer.entity';
import { CreateCustomerDto } from 'src/clients/interfaces/create-customer.dto';
import { LoginDto } from './interfaces/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateCustomer(email: string, pass: string): Promise<Customer> {
    // Find the customer by email
    const customer = await this.clientsService.findByEmail(email);

    // If customer not found, throw an exception
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Comparing the passwords
    const isMatch = await bcrypt.compare(pass, customer.password);

    // If they don't match, throw an exception
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If everything is fine, return the customer
    return customer;
  }

  // Function to register a new customer
  async register(dto: CreateCustomerDto) {
    // find if customer with email already exists
    const oldCustomer = await this.clientsService.findByUniqueFields(
      dto.email,
      dto.document,
      dto.phone,
    );

    // If a customer is found, throw an exception
    if (oldCustomer) {
      throw new ConflictException(
        'A customer with the same email, document or phone already exists',
      );
    }

    // Create the salt for the password
    const salt = await bcrypt.genSalt();

    // hash password before saving
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    try {
      // Create the customer with the hashed password and salt
      const customer = await this.clientsService.create({
        ...dto,
        password: hashedPassword,
      });

      // Return success message and customer info
      return {
        message: 'Customer registered successfully',
        customer: {
          id: customer.id,
          names: customer.names,
          email: customer.email,
          document: customer.document,
          phone: customer.phone,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error registering customer', 500);
    }
  }

  // Function to generate JWT token for authenticated customer. At this point the customer is already validated
  async login(loginDto: LoginDto) {
    try {
      // Validate the customer credentials
      const customer = await this.validateCustomer(
        loginDto.email,
        loginDto.password,
      );

      // Payload for the token
      const payload = { sub: customer.id, email: customer.email };

      // Return the signed token and some customer info
      return {
        access_token: this.jwtService.sign(payload),
        customer: {
          id: customer.id,
          names: customer.names,
          email: customer.email,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
