import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservation.repository';
import { PAYMENTS_SERVICE } from '@app/common/constants/constants';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '@app/common/dtos/user.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    try {
      this.paymentsService
        .send('create_charge', {
          amount: createReservationDto?.charge?.amount,
          email,
        })
        .subscribe(async (response) => {
          const reservation = await this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: response?.id,
            timestamp: new Date(),
            userId,
          });

          // console.log(reservation);
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
