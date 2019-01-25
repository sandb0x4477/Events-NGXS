using System.Linq;
using AutoMapper;
using Backend.Data;

namespace Backend.Dtos
{
  public class AutoMapperProfiles : Profile
  {
    public AutoMapperProfiles()
    {
      CreateMap<User, UserForReturnDto>();
      //        .ForMember(dest => dest.PhotoUrl, opt =>
      //          opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).PhotoUrl));
      //
      //      CreateMap<Photo, PhotoForReturnDto>();

      //    Photos
      CreateMap<PhotoForCreationDto, Photo>();
      CreateMap<Photo, PhotoForReturnDto>();

      CreateMap<UserForUpdateDto, User>()
        .ForAllMembers(c => c.UseDestinationValue());
      CreateMap<EventForUpdateDto, Event>()
        .ForAllMembers(c => c.UseDestinationValue());
      CreateMap<EventForCreationDto, Event>();
      CreateMap<Event, EventForReturnDto>();
      CreateMap<EventUser, Attendee>()
        .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
        .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
        .ForMember(dest => dest.PhotoUrl,
          opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(up => up.IsMain).PhotoUrl));

      CreateMap<Activity, ActivityForReturnDto>()
        .ForMember(dest => dest.PhotoUrl,
          opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(up => up.IsMain).PhotoUrl));
      CreateMap<Chat, ChatForReturnDto>()
        .ForMember(dest => dest.PhotoUrl,
          opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(up => up.IsMain).PhotoUrl));
      CreateMap<Chat, MessageForReturnDto>()
        .ForMember(dest => dest.PhotoUrl,
          opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(up => up.IsMain).PhotoUrl));
      CreateMap<MessageForCreationDto, Chat>();
    }
  }
}
//
//      CreateMap<Event, EventForReturnDto>()
//        .ForMember(dest => dest.HostPhotoUrl, opt =>
//        opt.MapFrom(src => src.Host.Photos.FirstOrDefault(hp => hp.IsMain).PhotoUrl))
////        .ForMember(dest => dest.EventUsers, opt => opt.Condition(src => src.HostId != src.EventUsers. ))
//        ;
//
//      CreateMap<EventUser, _EventUser>()
//        .ForMember(dest => dest.UserId, opt => { opt.MapFrom(src => src.UserId); })
//        .ForMember(dest => dest.UserName, opt =>
//          opt.MapFrom(src => src.User.UserName))
//        .ForMember(dest => dest.PhotoUrl,
//          opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(up => up.IsMain).PhotoUrl))
////        .ForAllMembers(opt => opt.PreCondition(src => src.User.Id != src.Event.HostId))
//        ;
